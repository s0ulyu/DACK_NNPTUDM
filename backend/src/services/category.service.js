// ==========================================
// SERVICE: Category
// Quản lý Danh mục (Category) - Mỹ Tâm
// Ý nghĩa: Tầng này chứa logic nghiệp vụ (business logic). Nó kiểm tra dữ liệu trước khi gọi Repository để lưu xuống CSDL.
// ==========================================
const categoryRepository = require('../repositories/category.repository');

class CategoryService {
  // Hàm xử lý logic tạo danh mục mới
  async createCategory(data) {
    // Kiểm tra tính hợp lệ: bắt buộc người dùng phải truyền vào tên danh mục
    if (!data.name) {
      throw new Error('Tên danh mục là bắt buộc');
    }
    // Nếu dữ liệu hợp lệ thì đẩy sang Repository để thực hiện câu lệnh Insert
    return await categoryRepository.create(data);
  }

  // Hàm lấy toàn bộ danh mục
  async getAllCategories() {
    return await categoryRepository.findAll();
  }

  // Hàm xử lý logic cập nhật danh mục
  async updateCategory(id, data) {
    // Bước 1: Tìm xem danh mục cần sửa có tồn tại trong CSDL không
    const existingCategory = await categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error('Không tìm thấy danh mục để cập nhật');
    }
    // Bước 2: Nếu có tồn tại thì mới gọi Repository thực hiện lệnh Update
    await categoryRepository.update(id, data);
    return await categoryRepository.findById(id);
  }

  // Hàm xử lý logic xóa danh mục
  async deleteCategory(id) {
    // Thử xóa, nếu deletedCount = 0 nghĩa là ID không tồn tại hoặc chưa bị xóa
    const deletedCount = await categoryRepository.delete(id);
    if (deletedCount === 0) throw new Error('Không tìm thấy danh mục để xóa');
    return true;
  }
}

module.exports = new CategoryService();