// ==========================================
// CONTROLLER: User (Người 1 phụ trách)
// User profile, update profile, upload avatar
// ==========================================
const { User, Role } = require('../models');
const { Op } = require('sequelize');
const response = require('../utils/responseHelper');
const fs = require('fs');
const path = require('path');

// GET /api/user/profile - Lấy thông tin profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{
        model: Role,
        attributes: ['name']
      }],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return response.error(res, 'User không tồn tại', 404);
    }

    return response.success(res, user, 'Lấy profile thành công');
  } catch (err) {
    next(err);
  }
};

// PUT /api/user/profile - Cập nhật profile
const updateProfile = async (req, res, next) => {
  try {
    const { full_name, email } = req.body;
    const userId = req.user.id;

    // Kiểm tra email trùng nếu thay đổi
    if (email) {
      const existingUser = await User.findOne({
        where: { email, id: { [Op.ne]: userId } }
      });
      if (existingUser) {
        return response.error(res, 'Email đã tồn tại', 409);
      }
    }

    const updateData = {};
    if (full_name) updateData.full_name = full_name;
    if (email) updateData.email = email;

    await User.update(updateData, { where: { id: userId } });

    const updatedUser = await User.findByPk(userId, {
      include: [{
        model: Role,
        attributes: ['name']
      }],
      attributes: { exclude: ['password'] }
    });

    return response.success(res, updatedUser, 'Cập nhật profile thành công');
  } catch (err) {
    next(err);
  }
};

// POST /api/user/avatar - Upload avatar
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return response.error(res, 'Không có file được upload', 400);
    }

    const userId = req.user.id;
    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    // Xóa avatar cũ nếu có
    const user = await User.findByPk(userId);
    if (user.avatar) {
      const oldAvatarPath = path.join(__dirname, '../../', user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Cập nhật avatar mới
    await User.update({ avatar: avatarPath }, { where: { id: userId } });

    const updatedUser = await User.findByPk(userId, {
      include: [{
        model: Role,
        attributes: ['name']
      }],
      attributes: { exclude: ['password'] }
    });

    return response.success(res, updatedUser, 'Upload avatar thành công');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar
};