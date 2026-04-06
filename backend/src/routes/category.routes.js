// ==========================================
// ROUTES: Category
// Quản lý Danh mục (Category) - Mỹ Tâm
// Ý nghĩa: Nơi định nghĩa URL và TRẢ VỀ RESPONSE (res.json) 
// ==========================================
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

router.post('/', async (req, res) => {
  try {
    const data = await categoryController.create(req);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await categoryController.getAll(req);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = await categoryController.update(req);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await categoryController.delete(req);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

module.exports = router;