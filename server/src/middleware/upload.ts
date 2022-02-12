import multer from 'multer';

const maxSize = 200 * 1024 * 1024; // max file size in bytes: 200 MB

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, `case-study-${Date.now()}-${fileName}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    const match = ['image/png', 'image/jpeg', 'image/jpg'];
    if (match.indexOf(file.mimetype) === -1) {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    } else {
      cb(null, true);
    }
  }
});

export default upload;
