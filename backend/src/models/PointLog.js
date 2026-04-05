// ==========================================
// MODEL: PointLog ⭐ (Người 3 - Trần Biện Minh Tâm)
// Lưu lịch sử cộng/trừ điểm
// ==========================================
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PointLog = sequelize.define('PointLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  source_type: {
    type: DataTypes.ENUM('task', 'habit', 'reward'),
    allowNull: false
  },
  source_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  action: {
    type: DataTypes.ENUM('earn', 'redeem'),
    allowNull: false
  },
  note: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'point_logs',
  timestamps: true,
  updatedAt: false, // chỉ cần created_at
  underscored: true
});

module.exports = PointLog;
