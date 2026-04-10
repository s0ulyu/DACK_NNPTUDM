// ==========================================
// CONTROLLER: Point ⭐ (Người 3)
// ==========================================
const pointService = require('../services/pointService');
const response = require('../utils/responseHelper');

class PointController {
  async getHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const { rows, count } = await pointService.getHistory(userId, req.query);
      return response.paginated(res, rows, req.query.page || 1, req.query.limit || 10, count);
    } catch (err) {
      next(err);
    }
  }

  async getHistoryByUserId(req, res, next) {
    try {
      const { rows, count } = await pointService.getHistory(req.params.userId, req.query);
      return response.paginated(res, rows, req.query.page || 1, req.query.limit || 10, count);
    } catch (err) {
      next(err);
    }
  }

  async getSummary(req, res, next) {
    try {
      const summary = await pointService.getSummary(req.user.id);
      return response.success(res, summary);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PointController();
