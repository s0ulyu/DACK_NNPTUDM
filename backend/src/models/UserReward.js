// ==========================================
// MODEL: UserReward ⭐ (Người 3 - Trần Biện Minh Tâm)
// Lịch sử user đổi thưởng
// ==========================================
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserReward = sequelize.define('UserReward', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reward_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  redeemed_points: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'received', 'cancelled'),
    defaultValue: 'pending'
  },
  redeemed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'user_rewards',
  timestamps: false
});

module.exports = UserReward;
