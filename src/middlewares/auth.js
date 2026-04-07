// ==========================================
// MIDDLEWARE: Auth (STUB - Người 1 sẽ hoàn thiện)
// Tạm thời để test, chờ Người 1 code JWT
// ==========================================
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const response = require('../utils/responseHelper');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return response.error(res, 'Vui lòng đăng nhập', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return response.error(res, 'User không tồn tại', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    return response.error(res, 'Token không hợp lệ', 401);
  }
};

module.exports = auth;
