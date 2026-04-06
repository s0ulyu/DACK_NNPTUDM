// ==========================================
// ROUTES: Habit
// Quản lý Thói quen (Habit) - Mỹ Tâm
// ==========================================
const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habit.controller');

router.post('/', async (req, res) => {
  try {
    const data = await habitController.create(req);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await habitController.getAll(req);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = await habitController.update(req);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await habitController.delete(req);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

router.post('/:id/checkin', async (req, res) => {
  try {
    const result = await habitController.checkin(req);
    res.status(200).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;