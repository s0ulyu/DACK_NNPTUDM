// ==========================================
// CONTROLLER: Admin
// Admin dashboard stats and management
// ==========================================
const { User, Reward, PointLog, Category } = require('../models');
const response = require('../utils/responseHelper');

// GET /api/admin/stats/users - Thống kê users
const getUserStats = async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    // For simplicity, consider all users as active
    const activeUsers = totalUsers;

    return response.success(res, {
      totalUsers,
      activeUsers
    }, 'Lấy thống kê users thành công');
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/users - Danh sách tất cả users (admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      include: [{
        model: require('../models').Role,
        attributes: ['name']
      }],
      attributes: { exclude: ['password'] },
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return response.success(res, {
      users,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    }, 'Lấy danh sách users thành công');
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/stats/overview - Thống kê tổng quan
const getOverviewStats = async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    const totalRewards = await Reward.count();

    // Calculate total points in system (sum of all point logs)
    const totalPointsResult = await PointLog.sum('points');

    return response.success(res, {
      totalUsers,
      totalRewards,
      totalPoints: totalPointsResult || 0
    }, 'Lấy thống kê tổng quan thành công');
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/categories - Danh sách tất cả categories
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      order: [['created_at', 'DESC']]
    });

    return response.success(res, categories, 'Lấy danh sách categories thành công');
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/categories - Tạo category mới
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return response.error(res, 'Tên category là bắt buộc', 400);
    }

    const category = await Category.create({
      name,
      description
    });

    return response.success(res, category, 'Tạo category thành công', 201);
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/categories/:id - Cập nhật category
const updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return response.error(res, 'Category không tồn tại', 404);
    }

    await category.update({
      name,
      description
    });

    return response.success(res, category, 'Cập nhật category thành công');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/categories/:id - Xóa category
const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return response.error(res, 'Category không tồn tại', 404);
    }

    await category.destroy();

    return response.success(res, null, 'Xóa category thành công');
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/stats/combined - Thống kê tổng hợp (tối ưu performance)
const getCombinedStats = async (req, res, next) => {
  try {
    // Execute all queries in parallel for better performance
    const [totalUsersResult, totalRewardsResult, totalPointsResult, activeUsersResult] = await Promise.all([
      User.count(),
      Reward.count(),
      PointLog.sum('points'),
      User.count() // For now, consider all users as active
    ]);

    return response.success(res, {
      totalUsers: totalUsersResult || 0,
      totalRewards: totalRewardsResult || 0,
      totalPoints: totalPointsResult || 0,
      activeUsers: activeUsersResult || 0
    }, 'Lấy thống kê tổng hợp thành công');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserStats,
  getAllUsers,
  getOverviewStats,
  getCombinedStats,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};