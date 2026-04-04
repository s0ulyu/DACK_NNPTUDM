// ==========================================
// ROUTES: Auth Test (TẠM THỜI - để test)
// Người 1 sẽ thay thế bằng auth routes chính thức
// ==========================================
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Leaderboard } = require('../models');
const response = require('../utils/responseHelper');

// POST /api/auth/register - Đăng ký tạm
router.post('/register', async (req, res, next) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return response.error(res, 'Vui lòng nhập đầy đủ thông tin', 400);
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return response.error(res, 'Email đã tồn tại', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      full_name,
      email,
      password: hashedPassword,
      role_id: 2 // default = user
    });

    // Tạo leaderboard entry
    await Leaderboard.create({
      user_id: user.id,
      total_points: 0,
      level: 1,
      rank_position: null
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    return response.success(res, {
      user: { id: user.id, full_name: user.full_name, email: user.email },
      token
    }, 'Đăng ký thành công', 201);
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login - Đăng nhập tạm
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return response.error(res, 'Vui lòng nhập email và password', 400);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return response.error(res, 'Email hoặc password không đúng', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response.error(res, 'Email hoặc password không đúng', 401);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    return response.success(res, {
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        total_points: user.total_points,
        level: user.level,
        role_id: user.role_id
      },
      token
    }, 'Đăng nhập thành công');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
