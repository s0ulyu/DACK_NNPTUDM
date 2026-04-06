// ==========================================
// CONTROLLER: Category
// Quản lý Danh mục (Category) - Mỹ Tâm
// Ý nghĩa: Nhận Request, xử lý logic lấy dữ liệu và trả về object 
// ==========================================
const categoryService = require('../services/category.service');

class CategoryController {
  async create(req) {
    const data = {
      name: req.body.name,
      description: req.body.description,
      created_by: req.user ? req.user.id : 1 
    };
    return await categoryService.createCategory(data);
  }

  async getAll(req) {
    return await categoryService.getAllCategories();
  }

  async update(req) {
    return await categoryService.updateCategory(req.params.id, req.body);
  }

  async delete(req) {
    await categoryService.deleteCategory(req.params.id);
    return { message: 'Xóa danh mục thành công' };
  }
}

module.exports = new CategoryController();