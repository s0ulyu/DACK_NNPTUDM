const multer = require('multer');
const path = require('path');

// Storage cho reward images
const rewardStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/rewards'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `reward-${Date.now()}${ext}`);
  }
});

// Filter chỉ cho phép ảnh
const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép file ảnh (JPG, PNG, WEBP)'), false);
  }
};

const uploadReward = multer({
  storage: rewardStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = { uploadReward };
