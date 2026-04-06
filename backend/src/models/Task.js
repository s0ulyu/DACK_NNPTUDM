// ==========================================
// MODEL: Task 
// Quản lý Công việc (Task) - Mỹ Tâm
// Ý nghĩa: Định nghĩa cấu trúc bảng "tasks" lưu trữ công việc của người dùng
// ==========================================
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
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
  due_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  point_reward: {
    type: DataTypes.INTEGER,
    defaultValue: 10 // Hoàn thành mặc định được 10 điểm
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
  tableName: 'tasks',
  timestamps: true,
  underscored: true
});

module.exports = Task;