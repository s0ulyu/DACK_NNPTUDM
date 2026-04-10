// ==========================================
// REPOSITORY: Leaderboard ⭐ (Người 3)
// Truy vấn database cho Leaderboard
// ==========================================
const { Leaderboard, User } = require('../models');
const sequelize = require('../config/database');

class LeaderboardRepository {
  async getTopN(limit = 10) {
    return Leaderboard.findAll({
      include: [{
        model: User,
        attributes: ['id', 'full_name', 'avatar']
      }],
      order: [['total_points', 'DESC']],
      limit
    });
  }

  async findByUserId(userId) {
    return Leaderboard.findOne({ where: { user_id: userId } });
  }

  async upsert(userId, totalPoints, level, transaction = null) {
    const options = {};
    if (transaction) options.transaction = transaction;

    const existing = await Leaderboard.findOne({
      where: { user_id: userId },
      ...options
    });

    if (existing) {
      return existing.update({ total_points: totalPoints, level }, options);
    } else {
      return Leaderboard.create({
        user_id: userId,
        total_points: totalPoints,
        level
      }, options);
    }
  }

  // Cập nhật rank_position cho tất cả user
  async recalculateRanks(transaction = null) {
    const options = transaction ? { transaction } : {};
    // Dùng raw query để update rank dựa trên total_points
    await sequelize.query(
      `UPDATE leaderboards lb
       JOIN (
         SELECT id, ROW_NUMBER() OVER (ORDER BY total_points DESC) as new_rank
         FROM leaderboards
       ) ranked ON lb.id = ranked.id
       SET lb.rank_position = ranked.new_rank`,
      options
    );
  }
}

module.exports = new LeaderboardRepository();
