// ==========================================
// ROUTES: Leaderboard ⭐ (Người 3)
// ==========================================
const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const auth = require('../middlewares/auth');

// GET /api/leaderboard - Top 10
router.get('/', auth, leaderboardController.getTop);

// GET /api/leaderboard/me - Vị trí của mình
router.get('/me', auth, leaderboardController.getMyRank);

module.exports = router;
