// ==========================================
// MODEL: Habit 
// Quản lý Thói quen (Habit) - Mỹ Tâm
// Ý nghĩa: Định nghĩa bảng "habits" lưu trữ thói quen lặp lại của người dùng
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
    type: DataTypes.STRING(255),
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
  point_reward: {
    type: DataTypes.INTEGER,
    defaultValue: 5 // Thói quen thường ít điểm hơn Task nhưng được nhận mỗi ngày
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  last_checkin: {
    type: DataTypes.DATE,
    allowNull: true // Lưu lại thời gian lần cuối hoàn thành để tránh spam điểm
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