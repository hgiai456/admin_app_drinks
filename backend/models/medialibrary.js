import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class MediaLibrary extends Model {
    static associate(models) {
      MediaLibrary.belongsTo(models.User, {
        foreignKey: "uploaded_by",
        as: "uploader",
      });
    }

    // Helper method: Get usage info
    async getUsageInfo() {
      const models = sequelize.models;
      const usage = [];

      const checks = [
        { model: models.Product, column: "image", name: "Product" },
        { model: models.Category, column: "image", name: "Category" },
        { model: models.Brand, column: "image", name: "Brand" },
        { model: models.Store, column: "image", name: "Store" },
        { model: models.Banner, column: "image", name: "Banner" },
        { model: models.News, column: "image", name: "News" },
        { model: models.ProDetail, column: "img1", name: "ProDetail.img1" },
        { model: models.ProDetail, column: "img2", name: "ProDetail.img2" },
        { model: models.ProDetail, column: "img3", name: "ProDetail.img3" },
      ];

      for (const check of checks) {
        const count = await check.model.count({
          where: { [check.column]: this.file_url },
        });
        if (count > 0) {
          usage.push({ table: check.name, count });
        }
      }

      return usage;
    }
  }

  MediaLibrary.init(
    {
      file_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      file_url: {
        type: DataTypes.STRING(512),
        allowNull: false,
        unique: true,
      },
      file_size: DataTypes.INTEGER,
      mime_type: DataTypes.STRING(50),
      width: DataTypes.INTEGER,
      height: DataTypes.INTEGER,
      uploaded_by: DataTypes.INTEGER,
      usage_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      tags: {
        type: DataTypes.TEXT,
        get() {
          const rawValue = this.getDataValue("tags");
          return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
          this.setDataValue("tags", JSON.stringify(value || []));
        },
      },
    },
    {
      sequelize,
      modelName: "MediaLibrary",
      tableName: "media_library",
      timestamps: true,
    },
  );

  return MediaLibrary;
};
