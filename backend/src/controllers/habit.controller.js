// ==========================================
// CONTROLLER: Habit
// Quản lý Thói quen (Habit) - Mỹ Tâm
// ==========================================
const habitService = require('../services/habit.service');

class HabitController {
  async create(req) {
    const userId = req.user ? req.user.id : 1; 
    const data = { ...req.body, user_id: userId };
    return await habitService.createHabit(data);
  }

  async getAll(req) {
    const userId = req.user ? req.user.id : 1;
    return await habitService.getHabitsByUser(userId);
  }

  async update(req) {
    const userId = req.user ? req.user.id : 1;
    return await habitService.updateHabit(req.params.id, userId, req.body);
  }

  async delete(req) {
    const userId = req.user ? req.user.id : 1;
    await habitService.deleteHabit(req.params.id, userId);
    return { message: 'Xóa thói quen thành công' };
  }

  async checkin(req) {
    const userId = req.user ? req.user.id : 1;
    const result = await habitService.checkinHabit(req.params.id, userId);
    return { message: `Check-in thành công! Bạn nhận được ${result.points_earned} điểm.`, data: result };
  }
}

module.exports = new HabitController();