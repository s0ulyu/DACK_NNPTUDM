// ==========================================
// REPOSITORY: Reward ⭐ (Người 3)
// Truy vấn database cho Reward
// ==========================================
const { Reward } = require('../models');
const { Op } = require('sequelize');

class RewardRepository {
  async findAll(filters = {}) {
    const where = {};
    if (filters.status) where.status = filters.status;

    return Reward.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(filters.limit) || 10,
      offset: parseInt(filters.offset) || 0
    });
  }

  async findById(id) {
    return Reward.findByPk(id);
  }

  async create(data) {
    return Reward.create(data);
  }

  async update(id, data) {
    const reward = await Reward.findByPk(id);
    if (!reward) return null;
    return reward.update(data);
  }

  async softDelete(id) {
    const reward = await Reward.findByPk(id);
    if (!reward) return null;
    return reward.update({ status: 'inactive' });
  }

  // Dùng trong transaction - cần lock
  async findByIdForUpdate(id, transaction) {
    return Reward.findByPk(id, {
      lock: transaction.LOCK.UPDATE,
      transaction
    });
  }

  async decrementQuantity(id, transaction) {
    return Reward.increment({ quantity: -1 }, {
      where: { id },
      transaction
    });
  }
}

module.exports = new RewardRepository();
