import multer from 'multer';
import path from 'path';
import fs from 'fs';

// INDUSTRIAL_STORAGE_ENGINE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // FORMAT: ASSET_TIMESTAMP_ORIGINALNAME
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `ASSET_${uniqueSuffix}${path.extname(file.originalname).toUpperCase()}`);
  }
});

// PROTOCOL_FILTER
const fileFilter = (req: any, file: any, cb: any) => {
  // STRICT_INDUSTRIAL_WHITELIST
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    return cb(null, true);
  } else {
    cb(new Error('CRITICAL_MEDIA_FAILURE: Only secure image assets (.JPG, .PNG) are synchronized with the registry.'));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB INDUSTRIAL_OPTIMIZED_LIMIT
  },
  fileFilter: fileFilter
});
