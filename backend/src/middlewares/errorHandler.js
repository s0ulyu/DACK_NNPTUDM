// ==========================================
// MIDDLEWARE: Error Handler
// Xử lý lỗi global cho Express
// ==========================================

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Lỗi Multer (upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File quá lớn. Tối đa 5MB'
    });
  }

  if (err.message === 'Chỉ cho phép file ảnh (JPG, PNG, WEBP)') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Lỗi Sequelize validation
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: err.errors.map(e => e.message)
    });
  }

  // Lỗi Sequelize unique constraint
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Dữ liệu đã tồn tại'
    });
  }

  // Lỗi chung
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Lỗi server'
  });
};

module.exports = errorHandler;
