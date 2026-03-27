import multer from "multer";
import XLSX from "xlsx";
import db from "../models/index.js";
import { Sequelize, where } from "sequelize";
import { raw } from "express";
import { Edit2 } from "lucide-react";
const { Op } = Sequelize;

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", //.xlsx
      "application/vnd.ms-excel", //.xls
      "text/csv", //.csv
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only allow .xlsx, .xls, .csv"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file 5MB
});

export const uploadMiddleware = upload.single("file");

export async function importProDetails(req, res) {
  const transaction = await db.sequelize.transaction();

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Importing file:", req.file.originalname);

    //1. Đọc file Excel
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    //2. Chuyển thành JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
    });

    if (!rawData || rawData.length <= 1) {
      return res.status(400).json({ message: "File is empty or has no data" });
    }

    console.log("Raw data from Excel:", rawData);

    //3. Validate headers
    const requiredHeaders = [
      "name",
      "product_id",
      "size_id",
      "price",
      "quantity",
    ];
    const fileHeaders = Object.keys(rawData[0]).map((header) =>
      header.trim().toLowerCase(),
    );

    const missingHeaders = requiredHeaders.filter(
      (h) => !fileHeaders.includes(h),
    );

    if (missingHeaders.length > 0) {
      return res.status(400).json({
        message: `File thiếu những cột bắt buộc: ${missingHeaders.join(", ")}`,
        requiredHeaders,
        receivedHeaders: fileHeaders,
      });
    }

    //4. Lấy danh sách Products, Sizes, Stores để validate
    const [products, sizes, stores] = await Promise.all([
      db.Product.findAll({ attributes: ["id", "name"] }),
      db.Size.findAll({ attributes: ["id", "name"] }),
      db.Store.findAll({ attributes: ["id", "name"] }),
    ]);

    const productIds = new Set(products.map((p) => p.id));
    const sizeIds = new Set(sizes.map((s) => s.id));
    const storeIds = new Set(stores.map((s) => s.id));

    //Validate và chuẩn bị dữ liệu
    const validItems = [];
    const errors = [];

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const rowNumber = i + 2;
      const rowErrors = [];

      //Normalize keys
      const normalizedRow = {};
      Object.keys(row).forEach((key) => {
        normalizedRow[key.trim().toLowerCase()] = row[key];
      });

      const name = normalizedRow.name?.toString().trim();
      const productId = parseInt(normalizedRow.product_id);
      const sizeId = parseInt(normalizedRow.size_id);
      const storeId = parseInt(normalizedRow.store_id) || null;
      const price = parseFloat(normalizedRow.price);
      const oldprice = normalizedRow.oldprice
        ? parseInt(normalizedRow.oldprice)
        : null;
      const quantity = parseInt(normalizedRow.quantity);
      const buyturn = parseInt(normalizedRow.buyturn) || 0;
      const specification =
        normalizedRow.specification?.toString().trim() || "";
      const img1 = normalizedRow.img1?.toString().trim() || "";
      const img2 = normalizedRow.img2?.toString().trim() || "";
      const img3 = normalizedRow.img3?.toString().trim() || "";

      if (!name) {
        rowErrors.push("Tên sản phẩm không được để trống");
      }

      if (isNaN(productId) || !productIds.has(productId)) {
        rowErrors.push(`product_id ${normalizedRow.productId} không tồn tại`);
      }

      // Validate store_id (nếu có)
      if (storeId && !storeIds.has(storeId)) {
        rowErrors.push(`store_id "${normalizedRow.store_id}" không tồn tại`);
      }

      // Validate price
      if (isNaN(price) || price <= 0) {
        rowErrors.push(`Giá "${normalizedRow.price}" không hợp lệ`);
      }

      // Validate quantity
      if (isNaN(quantity) || quantity < 0) {
        rowErrors.push(`Số lượng "${normalizedRow.quantity}" không hợp lệ`);
      }

      if (rowErrors.length > 0) {
        ErrorSharp.push({
          row: rowNumber,
          name: name || `Dòng ${rowNumber}`,
          errors: rowErrors,
        });
      } else {
        validItems.push({
          name,
          product_id: productId,
          size_id: sizeId,
          store_id: storeId,
          price,
          oldprice,
          quantity,
          buyturn,
          specification,
          img1,
          img2,
          img3,
        });
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: `Tất cả ${errors.length} dòng đều có lỗi, vui lòng kiểm tra lại file`,
        errors,
      });
    }

    const duplicateCheck = [];
    for (const item of validItems) {
      const existing = await db.ProDetail.findOne({
        where: { name: item.name },
      });

      if (existing) {
        duplicateCheck.push({
          name: item.name,
          message: `"${item.name}" đã tồn tại (ID: ${existing.id})`,
        });
      }
    }

    const itemsToInsert = validItems.filter((item) => {
      return !duplicateCheck.find((d) => d.name === item.name);
    });
    // Logic: Là trả về mảng các item hợp lệ (filter) =>
    // Trong find kiểm tra xem có trùng tên những item trong mảng duplicateCheck hay không
    // Nếu tìm thấy thì sẽ trả ra đối tượng đó (true) nếu điều kiện
    // là !object thì filter sẽ bỏ không thêm nó vào mảng itemsToInsert

    if (duplicateCheck.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "Tất cả các dòng đều trùng tên với dữ liệu hiện có, không có dòng nào được thêm mới",
        duplicates: duplicateCheck,
        errors,
      });
    }

    const created = await db.ProDetail.bulkCreate(itemsToInsert, {
      transaction,
      validate: true,
    });

    await transaction.commit();

    res.status(200).json({
      message: `Import thành công ${created.length} dòng,
      ${duplicateCheck.length} dòng bị trùng tên và không được thêm mới`,

      summary: {
        total: rawData.length,
        success: created.length,
        errors: errors.length,
        duplicates: duplicateCheck.length,
      },
      errors: errors.length > 0 ? errors : undefined,
      duplicates: duplicateCheck.length > 0 ? duplicateCheck : undefined,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Import error:", error);
    return res.status(500).json({
      message: "Lỗi khi import: " + error.message,
    });
  }
}

export async function getAllProDetails(req, res) {
  try {
    const [products, sizes, stores] = await Promise.all([
      db.Product.findAll({ attributes: ["id", "name"] }),
      db.Size.findAll({ attributes: ["id", "name"] }),
      db.Store.findAll({ attributes: ["id", "name"] }),
    ]);

    const workbook = XLSX.utils.book_new();

    //Sheet 1: Template
    const templateData = [
      {
        name: "Cà phê sữa đá (Size S)",
        product_id: products[0]?.id || 1,
        size_id: sizes[0]?.id || 1,
        store_id: stores[0]?.id || 1,
        price: 29000,
        oldprice: 35000,
        quantity: 100,
        buyturn: 0,
        specification: "Cà phê nguyên chất",
        img1: "",
        img2: "",
        img3: "",
      },
      {
        name: "Cà phê sữa đá (Size M)",
        product_id: products[0]?.id || 1,
        size_id: sizes[1]?.id || 2,
        store_id: stores[0]?.id || 1,
        price: 35000,
        oldprice: 42000,
        quantity: 80,
        buyturn: 0,
        specification: "Cà phê nguyên chất",
        img1: "",
        img2: "",
        img3: "",
      },
    ];

    const ws1 = XLSX.utils.json_to_sheet(templateData);
    ws1["!cols"] = [
      { wch: 30 }, // name
      { wch: 12 }, // product_id
      { wch: 10 }, // size_id
      { wch: 10 }, // store_id
      { wch: 12 }, // price
      { wch: 12 }, // oldprice
      { wch: 10 }, // quantity
      { wch: 10 }, // buyturn
      { wch: 25 }, // specification
      { wch: 40 }, // img1
      { wch: 40 }, // img2
      { wch: 40 }, // img3
    ];

    XLSX.utils.book_append_sheet(workbook, ws1, "Template");

    //Sheet 2: Products Reference
    const productRef = products.map((p) => ({ id: p.id, name: p.name }));
    const ws2 = XLSX.utils.json_to_sheet(productRef);
    ws2["!cols"] = [{ wch: 8 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(workbook, ws2, "Products");

    //Sheet 3: Sizes Reference
    const sizeRef = sizes.map((s) => ({ id: s.id, name: s.name }));
    const ws3 = XLSX.utils.json_to_sheet(sizeRef);
    ws3["!cols"] = [{ wch: 8 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(workbook, ws3, "Sizes");

    //Sheet 4: Stores Reference
    const storeRef = stores.map((s) => ({ id: s.id, name: s.name }));
    const ws4 = XLSX.utils.json_to_sheet(storeRef);
    ws4["!cols"] = [{ wch: 8 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(workbook, ws4, "Stores");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", "attachment; filename=template.xlsx");
    res.send(buffer);
  } catch (error) {
    console.error("❌ Template error:", error);
    return res.status(500).json({
      message: "Lỗi khi tạo file mẫu: " + error.message,
    });
  }
}
