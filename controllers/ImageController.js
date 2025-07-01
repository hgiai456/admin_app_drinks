import path from 'path';
import fs from 'fs';
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { getStorage } from 'firebase/storage';
import config from '../config/firebaseConfig';
import { error } from 'console';
import db from '../models/index.js';
import { where } from 'sequelize';

const storage = getStorage();

export async function uploadImages(req, res) {
    if (req.files.length === 0) {
        throw new Error('Không có file nào được tải lên');
    }
    const uploadedImagesPath = req.files.map((file) =>
        path.basename(file.path)
    );
    res.status(200).json({
        message: 'Tải ảnh lên thành công',
        files: uploadedImagesPath
    });
}
//db.Category, db.Store, db.Product, db.Banner, db.ProDetail
async function checkImageInUse(imageUrl) {
    const modelQueries = [
        { model: db.User, column: 'avatar', name: 'User' },
        { model: db.Category, column: 'image', name: 'Category' },
        { model: db.Store, column: 'image', name: 'Store' },
        { model: db.Product, column: 'image', name: 'Product' },
        { model: db.Banner, column: 'image', name: 'Banner' },
        { model: db.Brand, column: 'image', name: 'Brand' },
        { model: db.ProDetail, column: 'img1', name: 'ProDetail.img1' },
        { model: db.ProDetail, column: 'img2', name: 'ProDetail.img2' },
        { model: db.ProDetail, column: 'img3', name: 'ProDetail.img3' }
    ];
    for (let query of modelQueries) {
        const result = await query.model.findOne({
            where: { [query.column]: imageUrl }
        });
        if (result) {
            console.log(
                `Hình ảnh đang được sử dụng ở bảng: ${query.name}, cột: ${query.column}, giá trị: ${imageUrl}`
            );
            return true;
        }
    }
    return false;
}

export async function deletedImage(req, res) {
    const { url: rawUrl } = req.body;
    const url = rawUrl.trim();

    try {
        if (await checkImageInUse(url)) {
            return res
                .status(500)
                .json({ message: 'Ảnh đang được sử dụng dưới cơ sở dữ liệu.' });
        }
        if (url.includes('https://firebasestorage.googleapis.com/')) {
            const fileRef = ref(storage, url);

            await deleteObject(fileRef);
            return res.status(200).json({ message: 'Ảnh đã xóa thành công' });
        } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
            const filePath = path.join(
                __dirname,
                '../uploads/',
                path.basename(url)
            );
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return res
                .status(200)
                .json({ message: 'Ảnh đã được xóa thành công' });
        } else {
            return res.status(400).json({ message: 'Không tìm thấy ảnh' });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Lỗi khi xóa ảnh ', error: error.message });
    }
}

export async function uploadImagesToGoogleStorage(req, res) {
    if (!req.file) {
        throw new Error('Không có file nào được tải lên');
    }
    const newFileName = `${Date.now()}-${req.file.originalname}`;
    const storageRef = ref(storage, `images/${newFileName}`);
    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, {
        contentType: req.file.mimetype
    });

    const dowloadURL = await getDownloadURL(snapshot.ref);

    res.status(201).json({
        message: 'Tải ảnh lên thành công',
        file: dowloadURL.trim()
    });
}

export async function viewImages(req, res) {
    const { fileName } = req.params;
    const imagePath = path.join(path.join(__dirname, '../uploads/'), fileName);
    fs.access(imagePath, fs.constants.F_OK, (error) => {
        if (error) {
            return res.status(404).send('Image not found');
        }
        res.sendFile(imagePath);
    });
}
