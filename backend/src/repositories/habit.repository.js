// ==========================================
// REPOSITORY: Habit
// Quản lý Thói quen (Habit) - Mỹ Tâm
// Ý nghĩa: Giao tiếp trực tiếp với DB cho bảng habits
// ==========================================
const { Habit } = require('../models');

class HabitRepository {
  async create(data) {
    return await Habit.create(data);
  }

  async findAllByUserId(userId) {
    return await Habit.findAll({ where: { user_id: userId }, order: [['created_at', 'DESC']] });
  }

  async findById(id) {
    return await Habit.findByPk(id);
  }

  async update(id, data) {
    return await Habit.update(data, { where: { id } });
  }

  async delete(id) {
    return await Habit.destroy({ where: { id } });
  }
}

module.exports = new HabitRepository();