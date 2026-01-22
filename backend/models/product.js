import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      if (models.Brand) {
        Product.belongsTo(models.Brand, {
          foreignKey: "brand_id",
          as: "brand",
        });
      }

      // Sản phẩm thuộc về một danh mục
      if (models.Category) {
        Product.belongsTo(models.Category, {
          foreignKey: "category_id",
          as: "category",
        });
      }

      // Một sản phẩm có nhiều chi tiết sản phẩm
      if (models.ProDetail) {
        Product.hasMany(models.ProDetail, {
          foreignKey: "product_id",
          as: "product_details",
        });
      }

      // Fix typo: BannerDetais -> BannerDetail
      if (models.BannerDetail) {
        Product.hasMany(models.BannerDetail, {
          foreignKey: "product_id",
          as: "banner_details",
        });
      }

      // Một sản phẩm có thể xuất hiện trong nhiều tin tức
      if (models.NewsDetail) {
        Product.hasMany(models.NewsDetail, {
          foreignKey: "product_id",
          as: "news_details",
        });
      }

      // Một sản phẩm có nhiều đánh giá
      if (models.FeedBack) {
        Product.hasMany(models.FeedBack, {
          foreignKey: "product_id",
          as: "feedbacks",
        });
      }

      // Một sản phẩm có nhiều hình ảnh
      if (models.ProductImage) {
        Product.hasMany(models.ProductImage, {
          foreignKey: "product_id",
          as: "product_images",
        });
      }
    }
  }
  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false, // Không cho phép giá trị null
        validate: {
          notEmpty: true, // Không cho phép chuỗi rỗng
          len: [1, 255], // Độ dài chuỗi từ 1 đến 255 ký tự
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false, // Không cho phép giá trị null
        validate: {
          notEmpty: true, // Không cho phép chuỗi rỗng
        },
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true, // Cho phép giá trị null
      },
      brand_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Không cho phép giá trị null
        validate: {
          isInt: true, // Kiểm tra giá trị là số nguyên
          min: 1, // Giá trị tối thiểu là 1
        },
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Không cho phép giá trị null
        validate: {
          isInt: true, // Kiểm tra giá trị là số nguyên
          min: 1, // Giá trị tối thiểu là 1
        },
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
    },
  );
  return Product;
};
