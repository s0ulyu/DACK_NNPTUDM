// ==========================================
// CONTROLLER: Task
// Quản lý Công việc (Task) - Mỹ Tâm
// ==========================================
const taskService = require('../services/task.service');

class TaskController {
  async create(req) {
    const userId = req.user ? req.user.id : 1; 
    const data = { ...req.body, user_id: userId };
    return await taskService.createTask(data);
  }

  async getAll(req) {
    const userId = req.user ? req.user.id : 1;
    return await taskService.getTasksByUser(userId);
  }

  async update(req) {
    const userId = req.user ? req.user.id : 1;
    return await taskService.updateTask(req.params.id, userId, req.body);
  }

  async delete(req) {
    const userId = req.user ? req.user.id : 1;
    await taskService.deleteTask(req.params.id, userId);
    return { message: 'Xóa Task thành công' };
  }

  async complete(req) {
    const userId = req.user ? req.user.id : 1;
    const result = await taskService.completeTask(req.params.id, userId);
    return { message: `Hoàn thành task thành công! Bạn nhận được ${result.points_earned} điểm.`, data: result };
  }
}

module.exports = new TaskController();