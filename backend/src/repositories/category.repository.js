// ==========================================
// REPOSITORY: Category
// Quản lý Danh mục (Category) - Mỹ Tâm
// Tầng này chỉ chuyên thực hiện các câu lệnh truy vấn trực tiếp xuống Database (Thêm, sửa, xóa, lấy dữ liệu).
// ==========================================
const { Category } = require('../models');

class CategoryRepository {
  // Hàm tạo mới một danh mục (Insert into DB)
  async create(data) {
    return await Category.create(data);
  }

  // Hàm lấy toàn bộ danh sách danh mục (Select * from categories)
  async findAll() {
    return await Category.findAll();
  }

  // Hàm tìm kiếm 1 danh mục cụ thể dựa vào ID (Select by ID)
  async findById(id) {
    return await Category.findByPk(id);
  }

  // Hàm cập nhật thông tin danh mục theo ID (Update categories set ... where id=?)
  async update(id, data) {
    return await Category.update(data, { where: { id } });
  }

  // Hàm xóa danh mục khỏi cơ sở dữ liệu theo ID (Delete from categories where id=?)
  async delete(id) {
    return await Category.destroy({ where: { id } });
  }
}

module.exports = new CategoryRepository();