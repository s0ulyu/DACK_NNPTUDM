// ==========================================
// SERVER.JS - Entry Point
// Task & Habit Gamification System
// ==========================================
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');

const { sequelize } = require('./src/models');
const routes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');
const initSocket = require('./src/sockets');

const app = express();
const server = http.createServer(app);

// ===== MIDDLEWARE =====
app.use(cors({
  origin: process.env.SOCKET_CORS_ORIGIN || '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ===== ROUTES =====
app.use('/api', routes);

// ===== FRONTEND ROUTES =====
// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ===== ERROR HANDLER =====
app.use(errorHandler);

// ===== SOCKET.IO =====
initSocket(server);

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Tự động tạo database nếu chưa có (Hỗ trợ chạy ngay với Laragon)
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'task_gamification'}\`;`);
    await connection.end();

    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync models (tạo bảng nếu chưa có)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');

    // Seed default roles nếu chưa có
    const { Role } = require('./src/models');
    const roleCount = await Role.count();
    if (roleCount === 0) {
      await Role.bulkCreate([
        { name: 'admin' },
        { name: 'user' }
      ]);
      console.log('✅ Default roles created');
    }

    // Seed 1 User ảo để Người 2 test Task không bị lỗi khóa ngoại
    try {
      await sequelize.query(`INSERT IGNORE INTO users (id, full_name, email, password, role_id, total_points, level, created_at, updated_at) VALUES (1, 'Mỹ Tâm Test', 'mytam@test.com', '123456', 1, 0, 1, NOW(), NOW())`);
      console.log('✅ Default User (ID: 1) created for testing');
    } catch (e) {
      // Bỏ qua nếu cấu trúc bảng User của Người 1 có thay đổi
    }

    // Start listening
    server.listen(PORT, () => {
      console.log(`
🚀 ============================================
   Task & Habit Gamification API
   Running on: http://localhost:${PORT}
   API Docs:   http://localhost:${PORT}/api
   Socket.io:  ws://localhost:${PORT}
   Database:   ${process.env.DB_NAME}
🚀 ============================================
      `);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error.message);
    process.exit(1);
  }
}

startServer();
