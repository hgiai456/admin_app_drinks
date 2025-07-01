import path from 'path';
import multer from 'multer';
import config from '../config/firebaseConfig';

const fileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true);
    } else {
        callback(new Error('Chỉ được phép tải file ảnh!'), false);
    }
};

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});
/////

export default upload;
