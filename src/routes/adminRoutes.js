// ==========================================
// ROUTES: Admin
// Admin management routes
// ==========================================
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

// All admin routes require authentication and admin role
router.use(auth);
router.use(roleCheck('admin'));

// GET /api/admin/stats/users - Thống kê users
router.get('/stats/users', adminController.getUserStats);

// GET /api/admin/stats/overview - Thống kê tổng quan
router.get('/stats/overview', adminController.getOverviewStats);

// GET /api/admin/stats/combined - Thống kê tổng hợp (tối ưu)
router.get('/stats/combined', adminController.getCombinedStats);

// GET /api/admin/users - Danh sách tất cả users
router.get('/users', adminController.getAllUsers);

// GET /api/admin/categories - Danh sách tất cả categories
router.get('/categories', adminController.getAllCategories);

// POST /api/admin/categories - Tạo category mới
router.post('/categories', adminController.createCategory);

// PUT /api/admin/categories/:id - Cập nhật category
router.put('/categories/:id', adminController.updateCategory);

// DELETE /api/admin/categories/:id - Xóa category
router.delete('/categories/:id', adminController.deleteCategory);

module.exports = router;