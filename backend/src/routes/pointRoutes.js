// ==========================================
// ROUTES: Point ⭐ (Người 3)
// ==========================================
const express = require('express');
const router = express.Router();
const pointController = require('../controllers/pointController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

// GET /api/points/history - Lịch sử điểm của mình
router.get('/history', auth, pointController.getHistory);

// GET /api/points/history/:userId - Lịch sử điểm của user (admin)
router.get('/history/:userId', auth, roleCheck('admin'), pointController.getHistoryByUserId);

// GET /api/points/summary - Tổng hợp điểm + level + rank
router.get('/summary', auth, pointController.getSummary);

module.exports = router;
