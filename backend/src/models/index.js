// ==========================================
// Model Index - Associations (Quan hệ giữa các model)
// ==========================================
const sequelize = require('../config/database');

const Role = require('./Role');
const User = require('./User');
const Category = require('./Category');
const Task = require('./Task');
const Habit = require('./Habit');
const PointLog = require('./PointLog');
const Reward = require('./Reward');
const UserReward = require('./UserReward');
const Leaderboard = require('./Leaderboard');
const Notification = require('./Notification');

// ========== ASSOCIATIONS ==========

// Role 1 - n User
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

// User 1 - n Task
User.hasMany(Task, { foreignKey: 'user_id' });
Task.belongsTo(User, { foreignKey: 'user_id' });

// User 1 - n Habit
User.hasMany(Habit, { foreignKey: 'user_id' });
Habit.belongsTo(User, { foreignKey: 'user_id' });

// Category 1 - n Task
Category.hasMany(Task, { foreignKey: 'category_id' });
Task.belongsTo(Category, { foreignKey: 'category_id' });

// Category 1 - n Habit
Category.hasMany(Habit, { foreignKey: 'category_id' });
Habit.belongsTo(Category, { foreignKey: 'category_id' });

// User 1 - n PointLog
User.hasMany(PointLog, { foreignKey: 'user_id' });
PointLog.belongsTo(User, { foreignKey: 'user_id' });

// User 1 - n UserReward
User.hasMany(UserReward, { foreignKey: 'user_id' });
UserReward.belongsTo(User, { foreignKey: 'user_id' });

// Reward 1 - n UserReward
Reward.hasMany(UserReward, { foreignKey: 'reward_id' });
UserReward.belongsTo(Reward, { foreignKey: 'reward_id' });

// User 1 - 1 Leaderboard
User.hasOne(Leaderboard, { foreignKey: 'user_id' });
Leaderboard.belongsTo(User, { foreignKey: 'user_id' });

// User 1 - n Notification
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  Role,
  User,
  Category,
  Task,
  Habit,
  PointLog,
  Reward,
  UserReward,
  Leaderboard,
  Notification
};
