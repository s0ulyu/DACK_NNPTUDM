// ==========================================
// SOCKET: Main Setup ⭐ (Người 3 - Trần Biện Minh Tâm)
// Khởi tạo Socket.io + quản lý connections
// ==========================================
const { Server } = require('socket.io');
const socketAuth = require('./authSocket');

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  // Middleware xác thực JWT
  io.use(socketAuth);

  // Khi client kết nối
  io.on('connection', (socket) => {
    const userId = socket.user.id;
    console.log(`🟢 User ${socket.user.full_name} connected (socket: ${socket.id})`);

    // Join room riêng (cho notification cá nhân)
    socket.join(`user_${userId}`);

    // Join room chung (cho leaderboard + new reward)
    socket.join('global');

    // Event: Client xác nhận đã đọc notification
    socket.on('notification:read', async (data) => {
      try {
        const notificationService = require('../services/notificationService');
        if (data.id === 'all') {
          await notificationService.markAllAsRead(userId);
        } else {
          await notificationService.markAsRead(data.id, userId);
        }
      } catch (err) {
        socket.emit('error', { message: 'Lỗi khi đánh dấu đã đọc' });
      }
    });

    // Event: Disconnect
    socket.on('disconnect', () => {
      console.log(`🔴 User ${socket.user.full_name} disconnected`);
    });
  });

  // Lưu io instance vào global để các service có thể emit
  global.io = io;

  return io;
}

module.exports = initSocket;
