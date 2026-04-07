// ==========================================
// ROUTES: User (Người 1 phụ trách)
// User profile management
// ==========================================
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { uploadAvatar } = require('../config/multer');
const auth = require('../middlewares/auth');

// Tất cả routes đều cần auth
router.use(auth);

// GET /api/user/profile - Lấy profile
router.get('/profile', userController.getProfile);

// PUT /api/user/profile - Cập nhật profile
router.put('/profile', userController.updateProfile);

// POST /api/user/avatar - Upload avatar
router.post('/avatar', uploadAvatar.single('avatar'), userController.uploadAvatar);

module.exports = router;