// ==========================================
// REPOSITORY: UserReward ⭐ (Người 3)
// Truy vấn database cho UserReward
// ==========================================
const { UserReward, Reward, User } = require('../models');

class UserRewardRepository {
  async create(data, transaction = null) {
    const options = {};
    if (transaction) options.transaction = transaction;
    return UserReward.create(data, options);
  }

  async findByUserId(userId) {
    return UserReward.findAll({
      where: { user_id: userId },
      include: [{ model: Reward, attributes: ['title', 'image', 'point_cost'] }],
      order: [['redeemed_at', 'DESC']]
    });
  }
}

module.exports = new UserRewardRepository();
