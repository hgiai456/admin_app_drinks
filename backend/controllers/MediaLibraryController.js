import db from "../models/index.js";
import { Op} from "sequelize";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { getStorage } from "firebase/storage";
import { firebaseApp } from "../config/firebaseConfig.js";
import sizeOf from "image-size";
// import upload from "../middlewares/imageGoogleUpload.js";

const storage = getStorage(firebaseApp);

export async function getMedia(req, res) {
  try {
    const {
      page = 1,
      search = "",
      sortBy = "createdAt",
      order = "DESC",
    } = req.query;
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    const whereClause = search
      ? {
          [Op.or]: [
            { file_name: { [Op.like]: `%${search}%` } },
            { tags: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await db.MediaLibrary.findAndCountAll({
      where: whereClause,
      limit: pageSize,
      offset,
      order: [[sortBy, order]],
      include: [
        {
          model: db.User,
          as: "uploader",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    return res.status(200).json({
      message: "Lấy danh sách ảnh thành công",
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPage: Math.ceil(count / pageSize),
        totalItems: count,
      },
    });
  } catch (error) {
    console.error("Error fetching media library:", error);
    return res.status(500).json({
      message: "Lỗi khi lấy danh sách ảnh",
      error: error.message,
    });
  }
}

//upload image

export async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user?.id || null; // Giả sử bạn có user ID từ req.user
    const tags = req.body.tags ? JSON.parse(req.body.tags) : [];

    //upload to firebase storage
    const newFileName = `${Date.now()}-${req.file.originalname}`;
    const storageRef = ref(storage, `media-library/${newFileName}`);
    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, {
      contentType: req.file.mimetype,
    });

    const downloadURL = await getDownloadURL(snapshot.ref);

    //Lay kich thuoc anh
    const dimensions = sizeOf(req.file.buffer);

    //Luu vao database
    const media = await db.MediaLibrary.create({
      file_name: req.file.originalname,
      file_url: downloadURL.trim(),
      file_size: req.file.size,
      mime_type: req.file.mimetype,
      width: dimensions.width,
      height: dimensions.height,
      uploaded_by: userId,
      tags: tags,
    });

    return res.status(201).json({
      message: "Tải ảnh lên kho thành công",
      data: media,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi tải ảnh lên",
      error: error.message,
    });
  }
}

export async function getMediaById(req, res) {
  try {
    const { id } = req.params;
    const media = await db.MediaLibrary.findByPk(id, {
      include: [
        {
          model: db.User,
          as: "uploader",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    if (!media) {
      return res.status(404).json({
        message: "Không tìm thấy ảnh. ",
      });
    }

    const usageInfo = await media.getUsageInfo();

    return res.status(200).json({
      message: "Lấy ảnh thành công",
      data: {
        ...media.toJSON(),
        usage: usageInfo,
      },
    });
  } catch (error) {
    console.error("Error fetching media by ID:", error);
    return res.status(500).json({
      message: "Lỗi khi lấy ảnh",
      error: error.message,
    });
  }
}

export async function updateMedia(req, res) {
  try {
    const { id } = req.params;
    const { file_name, tags } = req.body;

    const [updated] = await db.MediaLibrary.update(
      { file_name, tags },
      { where: { id } },
    );

    if (updated) {
      return res.status(200).json({
        message: "Cập nhật thông tin ảnh thành công",
      });
    }

    return res.status(404).json({
      message: "Không tìm thấy ảnh để cập nhật",
    });
  } catch (error) {
    console.error("Error updating media info:", error);
    return res.status(500).json({
      message: "Lỗi khi cập nhật thông tin ảnh",
      error: error.message,
    });
  }
}

export async function uploadMultipleImages(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Không có file nào được tải lên",
      });
    } //Kiem tra nguoi dùng có chọn file không

    const userId = req.user?.id || null; // Giả sử bạn có user ID từ req.user
    const uploadedMedia = [];
    const errors = [];

    for (const file of req.files) {
      try {
        const newFileName = `${Date.now()}-${file.originalname}`;
        const storageRef = ref(storage, `media-library/${newFileName}`);
        const snapshot = await uploadBytesResumable(storageRef, file.buffer, {
          contentType: file.mimetype,
        });

        const downloadURL = await getDownloadURL(snapshot.ref);

        //Lấy kích thước ảnh
        const dimensions = sizeOf(file.buffer);

        const meda = await db.MediaLibrary.create({
          file_name: file.originalname,
          file_url: downloadURL.trim(),
          file_size: file.size,
          mime_type: file.mimetype,
          width: dimensions.width,
          height: dimensions.height,
          uploaded_by: userId,
          usage_count: 0,
          tags: "[]",
        });

        uploadedMedia.push(meda);
      } catch (error) {
        console.error(`Lỗi upload file ${file.originalname}:`, error);
        errors.push({
          fileName: file.originalname,
          error: error.message,
        });
      }
    }

    return res.status(201).json({
      message: `Đã tải lên thành công ${uploadedMedia.length}/${req.files.length} ảnh`,
      data: uploadedMedia,
      errors: errors.length > 0 ? errors : undefined,
      summary: {
        total: req.files.length,
        success: uploadedMedia.length,
        failed: errors.length,
      },
    });
  } catch (error) {
    console.error("Lỗi upload nhiều ảnh:", error);
    return res.status(500).json({
      message: "Lỗi khi tải ảnh lên",
      error: error.message,
    });
  }
}

export async function deleteMedia(req, res) {
  try {
    const { id } = req.params;
    const media = await db.MediaLibrary.findByPk(id);

    if (!media) {
      return res.status(404).json({
        message: "Không tìm thấy ảnh để xóa",
      });
    }

    const usageInfo = await media.getUsageInfo();
    const totalUsage = usageInfo.reduce((sum, item) => sum + item.count, 0);
    if (totalUsage > 0) {
      return res.status(400).json({
        message: "Không thể xóa ảnh đang được sử dụng",
        usage: usageInfo,
      });
    }
    // Xóa ảnh Firebase Storage
    const fileRef = ref(storage, media.file_url);
    await deleteObject(fileRef).catch(() => {
      console.warn("File không tồn tại trên Firebase Storage");
    });

    await media.destroy();

    return res.status(200).json({
      message: "Xóa ảnh thành công",
    });
  } catch (error) {
    console.error("Error deleting media:", error);
    return res.status(500).json({
      message: "Lỗi khi xóa ảnh",
      error: error.message,
    });
  }
}

export async function incrementUsageCount(req, res) {
  try {
    const { file_url } = req.body;

    const media = await db.MediaLibrary.findOne({
      where: { file_url },
    });
    if (media) {
      await media.increment("usage_count");
      return res.status(200).json({ message: "Đã cập nhật usage count" });
    }

    return res.status(404).json({ message: "Không tìm thấy ảnh" });
  } catch (error) {
    console.error("Error incrementing usage count:", error);
    return res.status(500).json({
      message: "Lỗi khi cập nhật usage count",
      error: error.message,
    });
  }
}
