// ==========================================
// CONTROLLER: Leaderboard ⭐ (Người 3)
// ==========================================
const leaderboardService = require('../services/leaderboardService');
const response = require('../utils/responseHelper');

class LeaderboardController {
  async getTop(req, res, next) {
    try {
      const top = await leaderboardService.getTop10();
      return response.success(res, top);
    } catch (err) {
      next(err);
    }
  }

  async getMyRank(req, res, next) {
    try {
      const rank = await leaderboardService.getMyRank(req.user.id);
      return response.success(res, rank);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new LeaderboardController();
