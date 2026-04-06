// ==========================================
// REPOSITORY: Task
// Quản lý Công việc (Task) - Mỹ Tâm
// Ý nghĩa: Giao tiếp trực tiếp với DB (Thêm, Sửa, Xóa, Lấy danh sách)
// ==========================================
const { Task } = require('../models');

class TaskRepository {
  // Hàm tạo công việc mới (Insert into tasks)
  async create(data) {
    return await Task.create(data);
  }

  // Hàm lấy danh sách công việc theo UserID, sắp xếp mới nhất lên đầu
  async findAllByUserId(userId) {
    // Chỉ lấy task của đúng user đang đăng nhập
    return await Task.findAll({ where: { user_id: userId }, order: [['created_at', 'DESC']] });
  }

  // Hàm tìm 1 công việc bằng ID
  async findById(id) {
    return await Task.findByPk(id);
  }

  // Hàm cập nhật công việc (Update tasks set... where id=?)
  async update(id, data) {
    return await Task.update(data, { where: { id } });
  }

  // Hàm xóa công việc (Delete from tasks where id=?)
  async delete(id) {
    return await Task.destroy({ where: { id } });
  }
}

module.exports = new TaskRepository();