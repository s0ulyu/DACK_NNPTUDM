// ==========================================
// REPOSITORY: Notification ⭐ (Người 3)
// Truy vấn database cho Notification
// ==========================================
const { Notification } = require('../models');

class NotificationRepository {
  async create(data, transaction = null) {
    const options = {};
    if (transaction) options.transaction = transaction;
    return Notification.create(data, options);
  }

  async findByUserId(userId, filters = {}) {
    return Notification.findAndCountAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit: parseInt(filters.limit) || 10,
      offset: parseInt(filters.offset) || 0
    });
  }

  async countUnread(userId) {
    return Notification.count({
      where: { user_id: userId, is_read: false }
    });
  }

  async markAsRead(id, userId) {
    return Notification.update(
      { is_read: true },
      { where: { id, user_id: userId } }
    );
  }

  async markAllAsRead(userId) {
    return Notification.update(
      { is_read: true },
      { where: { user_id: userId, is_read: false } }
    );
  }
}

module.exports = new NotificationRepository();
