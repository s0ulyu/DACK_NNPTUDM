// ==========================================
// ROUTES: Notification ⭐ (Người 3)
// ==========================================
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middlewares/auth');

// GET /api/notifications - Danh sách thông báo
router.get('/', auth, notificationController.getAll);

// GET /api/notifications/unread-count - Số chưa đọc
router.get('/unread-count', auth, notificationController.getUnreadCount);

// PUT /api/notifications/read-all - Đánh dấu tất cả đã đọc
router.put('/read-all', auth, notificationController.markAllAsRead);

// PUT /api/notifications/:id/read - Đánh dấu 1 cái đã đọc
router.put('/:id/read', auth, notificationController.markAsRead);

module.exports = router;
