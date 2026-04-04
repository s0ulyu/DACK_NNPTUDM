// ==========================================
// SERVICE: Reward ⭐ (Người 3 - Trần Biện Minh Tâm)
// CRUD + Redeem Transaction
// ==========================================
const sequelize = require('../config/database');
const rewardRepository = require('../repositories/rewardRepository');
const pointLogRepository = require('../repositories/pointLogRepository');
const userRewardRepository = require('../repositories/userRewardRepository');
const leaderboardService = require('./leaderboardService');
const notificationService = require('./notificationService');
const { User } = require('../models');
const { calculateLevel, checkLevelUp } = require('../utils/levelCalculator');

class RewardService {
  // ===== CRUD =====

  async getAll(filters) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    return rewardRepository.findAll({
      status: filters.status || 'active',
      limit,
      offset
    });
  }

  async getById(id) {
    const reward = await rewardRepository.findById(id);
    if (!reward) throw { statusCode: 404, message: 'Reward không tồn tại' };
    return reward;
  }

  async create(data, userId) {
    data.created_by = userId;
    const reward = await rewardRepository.create(data);

    // Emit socket: thông báo có reward mới cho tất cả user
    if (global.io) {
      global.io.to('global').emit('reward:new', {
        reward: {
          id: reward.id,
          title: reward.title,
          point_cost: reward.point_cost,
          image: reward.image
        }
      });
    }

    // Tạo notification cho tất cả user
    await notificationService.notifyAll(
      'Phần thưởng mới!',
      `"${reward.title}" - ${reward.point_cost} điểm`,
      'new_reward'
    );

    return reward;
  }

  async update(id, data) {
    const reward = await rewardRepository.update(id, data);
    if (!reward) throw { statusCode: 404, message: 'Reward không tồn tại' };
    return reward;
  }

  async delete(id) {
    const reward = await rewardRepository.softDelete(id);
    if (!reward) throw { statusCode: 404, message: 'Reward không tồn tại' };
    return reward;
  }

  // ===== REDEEM TRANSACTION =====

  async redeem(rewardId, userId) {
    // Dùng Sequelize Managed Transaction
    const result = await sequelize.transaction(async (t) => {

      // 1. Lấy reward (lock for update)
      const reward = await rewardRepository.findByIdForUpdate(rewardId, t);
      if (!reward || reward.status !== 'active') {
        throw { statusCode: 404, message: 'Reward không tồn tại hoặc đã ngừng' };
      }

      // 2. Kiểm tra quantity
      if (reward.quantity !== -1 && reward.quantity <= 0) {
        throw { statusCode: 400, message: 'Reward đã hết hàng' };
      }

      // 3. Lấy user & kiểm tra điểm
      const user = await User.findByPk(userId, {
        lock: t.LOCK.UPDATE,
        transaction: t
      });
      if (user.total_points < reward.point_cost) {
        throw { statusCode: 400, message: `Không đủ điểm. Cần ${reward.point_cost}, bạn có ${user.total_points}` };
      }

      // 4. Trừ điểm user
      const oldPoints = user.total_points;
      const newPoints = oldPoints - reward.point_cost;
      const levelInfo = calculateLevel(newPoints);

      await user.update({
        total_points: newPoints,
        level: levelInfo.level
      }, { transaction: t });

      // 5. Trừ quantity reward (nếu không phải vô hạn)
      if (reward.quantity !== -1) {
        await rewardRepository.decrementQuantity(rewardId, t);
      }

      // 6. Tạo PointLog
      await pointLogRepository.create({
        user_id: userId,
        source_type: 'reward',
        source_id: rewardId,
        points: -reward.point_cost,
        action: 'redeem',
        note: `Đổi thưởng: ${reward.title}`
      }, t);

      // 7. Tạo UserReward
      const userReward = await userRewardRepository.create({
        user_id: userId,
        reward_id: rewardId,
        redeemed_points: reward.point_cost,
        status: 'pending',
        redeemed_at: new Date()
      }, t);

      // 8. Cập nhật Leaderboard
      await leaderboardService.updateUserRank(userId, newPoints, levelInfo.level, t);

      // 9. Tạo Notification
      await notificationService.create({
        user_id: userId,
        title: 'Đổi thưởng thành công!',
        content: `Bạn đã đổi "${reward.title}" với ${reward.point_cost} điểm`,
        type: 'reward_redeemed'
      }, t);

      return {
        userReward,
        remainingPoints: newPoints,
        level: levelInfo
      };
    });

    // Emit socket NGOÀI transaction (sau khi commit thành công)
    if (global.io) {
      global.io.to(`user_${userId}`).emit('notification:new', {
        title: 'Đổi thưởng thành công!',
        type: 'reward_redeemed'
      });

      // Cập nhật leaderboard cho tất cả
      const top10 = await leaderboardService.getTop10();
      global.io.to('global').emit('leaderboard:update', { top10 });
    }

    return result;
  }
}

module.exports = new RewardService();
