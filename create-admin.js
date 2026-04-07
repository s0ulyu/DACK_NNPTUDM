// ==========================================
// SCRIPT: Create Admin User
// Chạy script này để tạo tài khoản admin đầu tiên
// ==========================================
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, User, Role, Leaderboard } = require('./src/models');

async function createAdminUser() {
  try {
    // Kết nối database
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync models
    await sequelize.sync();
    console.log('✅ Database synced');

    // Kiểm tra xem đã có admin chưa
    const existingAdmin = await User.findOne({
      include: [{
        model: Role,
        where: { name: 'admin' }
      }]
    });

    if (existingAdmin) {
      console.log('❌ Admin user đã tồn tại:', existingAdmin.email);
      return;
    }

    // Tạo admin user
    const adminData = {
      full_name: 'Administrator',
      email: 'admin@gamification.com',
      password: await bcrypt.hash('admin123', 10),
      role_id: 1, // admin
      total_points: 0,
      level: 1
    };

    const admin = await User.create(adminData);

    // Tạo leaderboard entry
    await Leaderboard.create({
      user_id: admin.id,
      total_points: 0,
      level: 1,
      rank_position: null
    });

    // Tạo JWT token
    const token = jwt.sign(
      { id: admin.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    console.log('🎉 Admin user đã được tạo thành công!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123');
    console.log('🎫 JWT Token:', token);
    console.log('\n⚠️  Lưu ý: Đổi password ngay sau khi đăng nhập!');

  } catch (error) {
    console.error('❌ Lỗi tạo admin user:', error);
  } finally {
    await sequelize.close();
  }
}

// Chạy script
createAdminUser();