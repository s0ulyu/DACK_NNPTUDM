// ==========================================
// ROUTES: Index - Mount tất cả routes
// ==========================================
const express = require('express');
const router = express.Router();

// Mount routes
router.use('/auth', require('./authRoutes')); // TẠM - chờ Người 1
router.use('/categories', require('./category.routes')); // Quản lý Danh mục (Category) - Mỹ Tâm
router.use('/tasks', require('./task.routes')); // Quản lý Công việc (Task) - Mỹ Tâm
router.use('/habits', require('./habit.routes')); // Quản lý Thói quen (Habit) - Mỹ Tâm
router.use('/rewards', require('./rewardRoutes'));
router.use('/points', require('./pointRoutes'));
router.use('/leaderboard', require('./leaderboardRoutes'));
router.use('/notifications', require('./notificationRoutes'));

// Route test
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Task & Habit Gamification API',
    version: '1.0.0',
    endpoints: {
      rewards: '/api/rewards',
      points: '/api/points',
      leaderboard: '/api/leaderboard',
      notifications: '/api/notifications'
    }
  });
});

module.exports = router;
