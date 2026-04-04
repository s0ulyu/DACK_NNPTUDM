// ==========================================
// MODEL: Habit (Người 2 phụ trách)
// STUB - Người 2 sẽ hoàn thiện sau
// ==========================================
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Habit = sequelize.define('Habit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  frequency: {
    type: DataTypes.ENUM('daily', 'weekly'),
    defaultValue: 'daily'
  },
  target_days: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  current_streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  point_reward: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  status: {
    type: DataTypes.ENUM('active', 'paused', 'completed'),
    defaultValue: 'active'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'habits',
  timestamps: true,
  underscored: true
});

module.exports = Habit;
