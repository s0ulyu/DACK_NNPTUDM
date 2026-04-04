// ==========================================
// MODEL: Notification ⭐ (Người 3 - Trần Biện Minh Tâm)
// Thông báo realtime + lưu lịch sử
// ==========================================
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('task_completed', 'reward_redeemed', 'new_reward', 'ranking_updated'),
    allowNull: false
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'notifications',
  timestamps: true,
  updatedAt: false, // chỉ cần created_at
  underscored: true
});

module.exports = Notification;
