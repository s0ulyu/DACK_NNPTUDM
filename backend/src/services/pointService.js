// ==========================================
// SERVICE: Point ⭐ (Người 3 - Trần Biện Minh Tâm)
// Logic tính điểm + lịch sử
// ==========================================
const sequelize = require('../config/database');
const pointLogRepository = require('../repositories/pointLogRepository');
const leaderboardService = require('./leaderboardService');
const notificationService = require('./notificationService');
const { User } = require('../models');
const { calculateLevel, checkLevelUp } = require('../utils/levelCalculator');

class PointService {
  /**
   * Cộng điểm cho user (được Người 2 gọi khi complete task/habit)
   * @param {number} userId
   * @param {string} sourceType - 'task' hoặc 'habit'
   * @param {number} sourceId
   * @param {number} points - Số điểm cộng
   * @param {string} note
   * @param {object} transaction - Sequelize transaction (từ Người 2)
   */
  async earnPoints(userId, sourceType, sourceId, points, note, transaction = null) {
    const t = transaction || await sequelize.transaction();
    const isExternalTransaction = !!transaction;

    try {
      // 1. Lấy user
      const user = await User.findByPk(userId, {
        lock: t.LOCK.UPDATE,
        transaction: t
      });

      if (!user) throw { statusCode: 404, message: 'User không tồn tại' };

      // 2. Cộng điểm
      const oldPoints = user.total_points;
      const newPoints = oldPoints + points;
      const levelInfo = calculateLevel(newPoints);
      const levelCheck = checkLevelUp(oldPoints, newPoints);

      await user.update({
        total_points: newPoints,
        level: levelInfo.level
      }, { transaction: t });

      // 3. Tạo PointLog
      await pointLogRepository.create({
        user_id: userId,
        source_type: sourceType,
        source_id: sourceId,
        points: points,
        action: 'earn',
        note: note || `Hoàn thành ${sourceType}`
      }, t);

      // 4. Cập nhật Leaderboard
      await leaderboardService.updateUserRank(userId, newPoints, levelInfo.level, t);

      // 5. Tạo Notification
      await notificationService.create({
        user_id: userId,
        title: `+${points} điểm!`,
        content: note || `Bạn nhận ${points} điểm từ ${sourceType}`,
        type: 'task_completed'
      }, t);

      // Nếu không phải external transaction thì commit
      if (!isExternalTransaction) await t.commit();

      // 6. Emit socket (ngoài transaction)
      if (global.io) {
        global.io.to(`user_${userId}`).emit('notification:new', {
          title: `+${points} điểm!`,
          type: 'task_completed',
          points: newPoints
        });

        // Kiểm tra lên level
        if (levelCheck.leveledUp) {
          global.io.to(`user_${userId}`).emit('level:up', {
            newLevel: levelCheck.newLevel.level,
            levelName: levelCheck.newLevel.name,
            totalPoints: newPoints
          });
        }

        // Update leaderboard cho tất cả
        const top10 = await leaderboardService.getTop10();
        global.io.to('global').emit('leaderboard:update', { top10 });
      }

      return { newPoints, level: levelInfo, leveledUp: levelCheck.leveledUp };

    } catch (error) {
      if (!isExternalTransaction) await t.rollback();
      throw error;
    }
  }

  // Lấy lịch sử điểm
  async getHistory(userId, filters = {}) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    return pointLogRepository.findByUserId(userId, { limit, offset });
  }

  // Lấy tổng hợp điểm
  async getSummary(userId) {
    const user = await pointLogRepository.getSummary(userId);
    if (!user) throw { statusCode: 404, message: 'User không tồn tại' };

    const levelInfo = calculateLevel(user.total_points);
    const leaderboardEntry = await require('../repositories/leaderboardRepository').findByUserId(userId);

    return {
      userId: user.id,
      fullName: user.full_name,
      totalPoints: user.total_points,
      level: levelInfo.level,
      levelName: levelInfo.name,
      rank: leaderboardEntry?.rank_position || null
    };
  }
}

module.exports = new PointService();
