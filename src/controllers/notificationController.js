// ==========================================
// CONTROLLER: Notification ⭐ (Người 3)
// ==========================================
const notificationService = require('../services/notificationService');
const response = require('../utils/responseHelper');

class NotificationController {
  async getAll(req, res, next) {
    try {
      const { rows, count } = await notificationService.getByUserId(req.user.id, req.query);
      return response.paginated(res, rows, req.query.page || 1, req.query.limit || 10, count);
    } catch (err) {
      next(err);
    }
  }

  async getUnreadCount(req, res, next) {
    try {
      const count = await notificationService.getUnreadCount(req.user.id);
      return response.success(res, { unreadCount: count });
    } catch (err) {
      next(err);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const result = await notificationService.markAsRead(req.params.id, req.user.id);
      return response.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      const result = await notificationService.markAllAsRead(req.user.id);
      return response.success(res, result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NotificationController();
