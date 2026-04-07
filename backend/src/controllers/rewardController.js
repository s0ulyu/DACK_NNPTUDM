// ==========================================
// CONTROLLER: Reward ⭐ (Người 3)
// ==========================================
const rewardService = require('../services/rewardService');
const response = require('../utils/responseHelper');

class RewardController {
  async getAll(req, res, next) {
    try {
      const { rows, count } = await rewardService.getAll(req.query);
      return response.paginated(res, rows, req.query.page || 1, req.query.limit || 10, count);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const reward = await rewardService.getById(req.params.id);
      return response.success(res, reward);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const data = req.body;
      if (req.file) {
        data.image = `/uploads/rewards/${req.file.filename}`;
      }
      const reward = await rewardService.create(data, req.user.id);
      return response.success(res, reward, 'Tạo reward thành công', 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const data = req.body;
      if (req.file) {
        data.image = `/uploads/rewards/${req.file.filename}`;
      }
      const reward = await rewardService.update(req.params.id, data);
      return response.success(res, reward, 'Cập nhật reward thành công');
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await rewardService.delete(req.params.id);
      return response.success(res, null, 'Xóa reward thành công');
    } catch (err) {
      next(err);
    }
  }

  async redeem(req, res, next) {
    try {
      const result = await rewardService.redeem(req.params.id, req.user.id);
      return response.success(res, result, 'Đổi thưởng thành công!');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RewardController();
