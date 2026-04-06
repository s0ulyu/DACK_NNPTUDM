// ==========================================
// SERVICE: Task
// Quản lý Công việc (Task) - Mỹ Tâm
// Ý nghĩa: Chứa logic CRUD và đặc biệt là logic TRANSACTION hoàn thành Task
// ==========================================
const taskRepository = require('../repositories/task.repository');
// Import sequelize để dùng tính năng Transaction, và các Model khác (do người 1, 3 làm) để cộng điểm
const { sequelize, Task, User, PointLog, Leaderboard } = require('../models');

class TaskService {
  async createTask(data) {
    if (!data.title) throw new Error('Tiêu đề công việc là bắt buộc');
    return await taskRepository.create(data);
  }

  // Lấy danh sách công việc của một người dùng cụ thể
  async getTasksByUser(userId) {
    return await taskRepository.findAllByUserId(userId);
  }

  // Cập nhật công việc (chỉ cho phép cập nhật công việc của chính mình)
  async updateTask(id, userId, data) {
    const task = await taskRepository.findById(id);
    if (!task || task.user_id !== userId) throw new Error('Không tìm thấy công việc hợp lệ');
    await taskRepository.update(id, data);
    return await taskRepository.findById(id);
  }

  // Xóa công việc
  async deleteTask(id, userId) {
    const task = await taskRepository.findById(id);
    if (!task || task.user_id !== userId) throw new Error('Không tìm thấy công việc hợp lệ');
    await taskRepository.delete(id);
    return true;
  }

  // ==========================================
  // CHỨC NĂNG TRANSACTION: HOÀN THÀNH TASK
  // ==========================================
  async completeTask(taskId, userId) {
    // Bắt đầu một Transaction (Mọi thay đổi CSDL từ đây sẽ được đóng gói lại)
    const t = await sequelize.transaction();
    
    try {
      // Bước 1: Tìm task, kiểm tra điều kiện
      const task = await Task.findOne({ where: { id: taskId, user_id: userId }, transaction: t });
      if (!task) throw new Error('Không tìm thấy công việc');
      if (task.status === 'completed') throw new Error('Công việc này đã hoàn thành trước đó rồi');

      // Bước 2: Cập nhật trạng thái Task -> Completed
      task.status = 'completed';
      await task.save({ transaction: t }); // Lưu kèm biến t

      // Bước 3: Tìm User và cộng điểm
      const user = await User.findByPk(userId, { transaction: t });
      if (user) {
        user.total_points = (user.total_points || 0) + task.point_reward;
        // Tính Level (Ví dụ: 0-100: Lv1, >100: Lv2, >300: Lv3)
        if (user.total_points >= 300) user.level = 3;
        else if (user.total_points >= 100) user.level = 2;
        else user.level = 1;
        await user.save({ transaction: t }); // Lưu User kèm biến t

        // Bước 4: Ghi log cộng điểm (PointLog)
        if (PointLog) {
          await PointLog.create({
            user_id: userId, source_type: 'task', source_id: task.id,
            points: task.point_reward, action: 'earn', note: `Hoàn thành task: ${task.title}`
          }, { transaction: t }); // Lưu Log kèm biến t
        }
      }

      // Nếu tất cả các lệnh trên không có lỗi -> XÁC NHẬN LƯU VÀO DB
      await t.commit();
      return { task, points_earned: task.point_reward, total_points: user ? user.total_points : 0 };

    } catch (error) {
      // Nếu có BẤT KỲ LỖI NÀO xảy ra ở bất kỳ bước nào -> HỦY BỎ TOÀN BỘ thay đổi (Rollback)
      await t.rollback();
      throw error;
    }
  }
}
module.exports = new TaskService();