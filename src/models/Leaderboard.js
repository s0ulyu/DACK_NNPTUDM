// ==========================================
// MODEL: Leaderboard ⭐ (Người 3 - Trần Biện Minh Tâm)
// Bảng xếp hạng user theo điểm
// ==========================================
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Leaderboard = sequelize.define('Leaderboard', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  total_points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rank_position: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  tableName: 'leaderboards',
  timestamps: true,
  createdAt: false, // chỉ cần updated_at
  underscored: true
});

module.exports = Leaderboard;
