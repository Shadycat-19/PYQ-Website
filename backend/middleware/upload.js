const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../../uploads');
const papersDir = path.join(uploadsDir, 'papers');
const solutionsDir = path.join(uploadsDir, 'solutions');

// Ensure directories exist
[uploadsDir, papersDir, solutionsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage engine generator
const createStorage = (targetFolder, prefix) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, targetFolder);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
      // Sanitize extension
      const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.jpg';
      cb(null, `${prefix}_${uniqueSuffix}${safeExt}`);
    }
  });
};

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];

  if (allowedMimeTypes.includes(file.mimetype) && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, JPEG, PNG, WebP) are allowed!'), false);
  }
};

const uploadPaper = multer({
  storage: createStorage(papersDir, 'paper'),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit per file
  fileFilter: fileFilter
});

const uploadSolution = multer({
  storage: createStorage(solutionsDir, 'solution'),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit per file
  fileFilter: fileFilter
});

module.exports = {
  uploadPaper,
  uploadSolution
};
