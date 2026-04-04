// ==========================================
// MIDDLEWARE: Role Check (STUB - Người 1 sẽ hoàn thiện)
// Kiểm tra quyền admin/user
// ==========================================
const response = require('../utils/responseHelper');

const roleCheck = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return response.error(res, 'Chưa xác thực', 401);
      }

      // Lấy role name từ user
      const userRole = req.user.role_id === 1 ? 'admin' : 'user';

      if (!allowedRoles.includes(userRole)) {
        return response.error(res, 'Bạn không có quyền truy cập', 403);
      }

      next();
    } catch (err) {
      return response.error(res, 'Lỗi kiểm tra quyền', 500);
    }
  };
};

module.exports = roleCheck;
