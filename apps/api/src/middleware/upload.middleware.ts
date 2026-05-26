import multer from 'multer';

const storage = multer.memoryStorage();
const limits = { fileSize: 100 * 1024 * 1024 }; // 100MB

export const uploadImage = multer({
  storage,
  limits,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
}).single('file');

export const uploadVideo = multer({
  storage,
  limits,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only videos are allowed'));
    }
  }
}).single('file');

export const uploadAny = multer({ storage, limits }).single('file');
