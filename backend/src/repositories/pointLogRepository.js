// ==========================================
// REPOSITORY: PointLog ⭐ (Người 3)
// Truy vấn database cho PointLog
// ==========================================
const { PointLog, User } = require('../models');

class PointLogRepository {
  async create(data, transaction = null) {
    const options = {};
    if (transaction) options.transaction = transaction;
    return PointLog.create(data, options);
  }

  async findByUserId(userId, filters = {}) {
    return PointLog.findAndCountAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit: parseInt(filters.limit) || 10,
      offset: parseInt(filters.offset) || 0
    });
  }

  async getSummary(userId) {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'full_name', 'total_points', 'level']
    });
    return user;
  }
}

module.exports = new PointLogRepository();
