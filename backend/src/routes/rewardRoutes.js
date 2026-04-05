// ==========================================
// ROUTES: Reward ⭐ (Người 3)
// ==========================================
const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const { uploadReward } = require('../config/multer');

// GET /api/rewards - Lấy danh sách (tất cả user)
router.get('/', auth, rewardController.getAll);

// GET /api/rewards/:id - Chi tiết 1 reward
router.get('/:id', auth, rewardController.getById);

// POST /api/rewards - Tạo mới (chỉ admin)
router.post('/', auth, roleCheck('admin'), uploadReward.single('image'), rewardController.create);

// PUT /api/rewards/:id - Cập nhật (chỉ admin)
router.put('/:id', auth, roleCheck('admin'), uploadReward.single('image'), rewardController.update);

// DELETE /api/rewards/:id - Xóa (chỉ admin, soft delete)
router.delete('/:id', auth, roleCheck('admin'), rewardController.delete);

// POST /api/rewards/:id/redeem - Đổi thưởng (user) ⭐ TRANSACTION
router.post('/:id/redeem', auth, rewardController.redeem);

module.exports = router;
