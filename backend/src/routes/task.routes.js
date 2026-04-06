// ==========================================
// ROUTES: Task
// Quản lý Công việc (Task) - Mỹ Tâm
// ==========================================
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

router.post('/', async (req, res) => {
  try {
    const data = await taskController.create(req);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await taskController.getAll(req);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = await taskController.update(req);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await taskController.delete(req);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

router.post('/:id/complete', async (req, res) => {
  try {
    const result = await taskController.complete(req);
    res.status(200).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;