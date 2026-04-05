// ==========================================
// SOCKET: JWT Auth Middleware ⭐ (Người 3)
// Xác thực JWT cho socket connections
// ==========================================
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      return next(new Error('Vui lòng đăng nhập'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return next(new Error('User không tồn tại'));
    }

    // Attach user vào socket
    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Token không hợp lệ'));
  }
};

module.exports = socketAuth;
