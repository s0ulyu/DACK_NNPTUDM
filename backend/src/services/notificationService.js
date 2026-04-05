// ==========================================
// SERVICE: Notification ⭐ (Người 3 - Trần Biện Minh Tâm)
// Tạo + quản lý thông báo
// ==========================================
const notificationRepository = require('../repositories/notificationRepository');
const { User } = require('../models');

class NotificationService {
  async create(data, transaction = null) {
    return notificationRepository.create(data, transaction);
  }

  // Gửi thông báo cho tất cả user (VD: khi admin tạo reward mới)
  async notifyAll(title, content, type) {
    const users = await User.findAll({ attributes: ['id'] });
    const notifications = users.map(user => ({
      user_id: user.id,
      title,
      content,
      type,
      is_read: false
    }));

    // Bulk create
    const { Notification } = require('../models');
    await Notification.bulkCreate(notifications);
  }

  // Tạo notification + emit socket
  async createAndEmit(userId, title, content, type) {
    const notification = await this.create({
      user_id: userId,
      title,
      content,
      type
    });

    // Emit qua socket
    if (global.io) {
      global.io.to(`user_${userId}`).emit('notification:new', {
        id: notification.id,
        title,
        content,
        type,
        created_at: notification.created_at
      });
    }

    return notification;
  }

  async getByUserId(userId, filters = {}) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    return notificationRepository.findByUserId(userId, { limit, offset });
  }

  async getUnreadCount(userId) {
    return notificationRepository.countUnread(userId);
  }

  async markAsRead(id, userId) {
    const result = await notificationRepository.markAsRead(id, userId);
    if (result[0] === 0) throw { statusCode: 404, message: 'Thông báo không tìm thấy' };
    return { message: 'Đã đánh dấu đã đọc' };
  }

  async markAllAsRead(userId) {
    await notificationRepository.markAllAsRead(userId);
    return { message: 'Đã đánh dấu tất cả đã đọc' };
  }
}

module.exports = new NotificationService();
