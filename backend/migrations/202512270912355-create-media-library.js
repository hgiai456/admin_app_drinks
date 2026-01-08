"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("media_library", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      file_name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Tên file gốc",
      },
      file_url: {
        type: Sequelize.STRING(512),
        allowNull: false,
        unique: true,
        comment: "URL đầy đủ từ Firebase Storage",
      },
      file_size: {
        type: Sequelize.INTEGER,
        comment: "Kích thước file (bytes)",
      },
      mime_type: {
        type: Sequelize.STRING,
        comment: "image/jpeg, image/png, etc.",
      },
      width: {
        type: Sequelize.INTEGER,
        comment: "Chiều rộng ảnh (px)",
      },
      height: {
        type: Sequelize.INTEGER,
        comment: "Chiều cao ảnh (px)",
      },
      uploaded_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        comment: "User ID người upload",
      },
      usage_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: "Số lần ảnh được sử dụng",
      },
      tags: {
        type: Sequelize.TEXT,
        comment: "Tags để tìm kiếm (JSON array)",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Index for performance
    await queryInterface.addIndex("media_library", ["uploaded_by"], {
      name: "idx_media_uploaded_by",
    });
    await queryInterface.addIndex("media_library", ["createdAt"], {
      name: "idx_media_created_at",
    });
    await queryInterface.addIndex("media_library", ["mime_type"], {
      name: "idx_media_mime_type",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("media_library");
  },
};
