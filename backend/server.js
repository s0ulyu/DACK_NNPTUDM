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
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync models (tạo bảng nếu chưa có)
    await sequelize.sync(); // Remove { alter: true } to avoid FK issues
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
