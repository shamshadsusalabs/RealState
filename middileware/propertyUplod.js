const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudnary');

// Storage settings
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'real-estate-properties',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

// Multer config
const upload = multer({
  storage,
  limits: {
    fileSize: 30 * 1024 * 1024, // 30 MB limit total
  },
});

module.exports = upload;
