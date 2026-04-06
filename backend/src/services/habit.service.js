// ==========================================
// SERVICE: Habit
// Quản lý Thói quen (Habit) - Mỹ Tâm
// Ý nghĩa: Chứa logic CRUD và TRANSACTION hoàn thành thói quen mỗi ngày
// ==========================================
const habitRepository = require('../repositories/habit.repository');
const { sequelize, Habit, User, PointLog } = require('../models');

class HabitService {
  async createHabit(data) {
    if (!data.title) throw new Error('Tiêu đề thói quen là bắt buộc');
    return await habitRepository.create(data);
  }

  async getHabitsByUser(userId) {
    return await habitRepository.findAllByUserId(userId);
  }

  async updateHabit(id, userId, data) {
    const habit = await habitRepository.findById(id);
    if (!habit || habit.user_id !== userId) throw new Error('Không tìm thấy thói quen hợp lệ');
    await habitRepository.update(id, data);
    return await habitRepository.findById(id);
  }

  async deleteHabit(id, userId) {
    const habit = await habitRepository.findById(id);
    if (!habit || habit.user_id !== userId) throw new Error('Không tìm thấy thói quen hợp lệ');
    await habitRepository.delete(id);
    return true;
  }

  // ==========================================
  // CHỨC NĂNG TRANSACTION: CHECK-IN THÓI QUEN
  // ==========================================
  async checkinHabit(habitId, userId) {
    const t = await sequelize.transaction();
    
    try {
      // Bước 1: Tìm habit
      const habit = await Habit.findOne({ where: { id: habitId, user_id: userId }, transaction: t });
      if (!habit) throw new Error('Không tìm thấy thói quen');
      if (habit.status !== 'active') throw new Error('Thói quen này đã bị vô hiệu hóa');

      // Bước 2: Kiểm tra xem hôm nay đã check-in chưa (chống gian lận)
      if (habit.last_checkin) {
        const lastCheckinDate = new Date(habit.last_checkin).toDateString();
        const todayDate = new Date().toDateString();
        if (lastCheckinDate === todayDate) {
          throw new Error('Bạn đã hoàn thành thói quen này hôm nay rồi. Hãy quay lại vào ngày mai nhé!');
        }
      }

      // Bước 3: Cập nhật thời gian check-in lần cuối
      habit.last_checkin = new Date();
      await habit.save({ transaction: t });

      // Bước 4: Cộng điểm cho User
      const user = await User.findByPk(userId, { transaction: t });
      if (user) {
        user.total_points = (user.total_points || 0) + habit.point_reward;
        
        // Tính Level
        if (user.total_points >= 300) user.level = 3;
        else if (user.total_points >= 100) user.level = 2;
        else user.level = 1;
        
        await user.save({ transaction: t });

        // Bước 5: Ghi log
        if (PointLog) {
          await PointLog.create({
            user_id: userId, source_type: 'habit', source_id: habit.id,
            points: habit.point_reward, action: 'earn', note: `Thực hiện thói quen: ${habit.title}`
          }, { transaction: t });
        }
      }

      // Xác nhận thay đổi
      await t.commit();
      return { habit, points_earned: habit.point_reward, total_points: user ? user.total_points : 0 };

    } catch (error) {
      // Hủy bỏ nếu có lỗi
      await t.rollback();
      throw error;
    }
  }
}
module.exports = new HabitService();