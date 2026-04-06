// ==========================================
// MODEL: Category (Người 2 phụ trách)
// Quản lý Danh mục (Category) - Mỹ Tâm
// ==========================================
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'categories',
  timestamps: true,
  underscored: true
});

module.exports = Category;
