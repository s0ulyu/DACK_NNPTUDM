// ==========================================
// UTIL: Response Helper
// Format response chuẩn cho tất cả API
// ==========================================

function success(res, data, message = 'Thành công', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

function error(res, message = 'Có lỗi xảy ra', statusCode = 500, errors = null) {
  const response = {
    success: false,
    message
  };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
}

function paginated(res, data, page, limit, total, message = 'Thành công') {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

module.exports = { success, error, paginated };
