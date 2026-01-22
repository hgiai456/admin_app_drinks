import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class ProDetail extends Model {
    static associate(models) {
      ProDetail.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product", // Thêm as nếu muốn truy cập là product
      });
      ProDetail.belongsTo(models.Size, {
        foreignKey: "size_id",
        as: "sizes",
      });

      ProDetail.hasMany(models.OrderDetail, {
        foreignKey: "product_detail_id",
        as: "order_details",
      });
      ProDetail.hasMany(models.CartItem, {
        foreignKey: "product_detail_id",
        as: "cart_items",
      });
      ProDetail.belongsTo(models.Store, {
        foreignKey: "store_id",
      });
    }
  }
  ProDetail.init(
    {
      name: DataTypes.TEXT,
      product_id: DataTypes.INTEGER,
      size_id: DataTypes.INTEGER,
      store_id: DataTypes.INTEGER,
      buyturn: DataTypes.INTEGER,
      specification: DataTypes.TEXT,
      price: DataTypes.INTEGER,
      oldprice: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      img1: DataTypes.TEXT,
      img2: DataTypes.TEXT,
      img3: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "ProDetail",
      tableName: "prodetails",
    },
  );
  return ProDetail;
};
