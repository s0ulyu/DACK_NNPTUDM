// ==========================================
// SERVICE: Leaderboard ⭐ (Người 3 - Trần Biện Minh Tâm)
// Xếp hạng + cập nhật
// ==========================================
const leaderboardRepository = require('../repositories/leaderboardRepository');

class LeaderboardService {
  async getTop10() {
    const entries = await leaderboardRepository.getTopN(10);
    return entries.map((entry, index) => ({
      rank: index + 1,
      userId: entry.user_id,
      fullName: entry.User?.full_name || 'Unknown',
      avatar: entry.User?.avatar || null,
      totalPoints: entry.total_points,
      level: entry.level
    }));
  }

  async getMyRank(userId) {
    const entry = await leaderboardRepository.findByUserId(userId);
    if (!entry) {
      return { rank: null, totalPoints: 0, level: 1 };
    }
    return {
      rank: entry.rank_position,
      totalPoints: entry.total_points,
      level: entry.level
    };
  }

  async updateUserRank(userId, totalPoints, level, transaction = null) {
    await leaderboardRepository.upsert(userId, totalPoints, level, transaction);
    // Recalculate tất cả rank sau khi cập nhật
    await leaderboardRepository.recalculateRanks(transaction);
  }
}

module.exports = new LeaderboardService();
