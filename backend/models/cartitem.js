"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CartItem.belongsTo(models.Cart, {
        foreignKey: "cart_id",
        as: "cart",
      });
      CartItem.belongsTo(models.ProDetail, {
        foreignKey: "product_detail_id",
        as: "product_details",
      });
    }
  }
  CartItem.init(
    {
      cart_id: DataTypes.INTEGER,
      product_detail_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CartItem",
      tableName: "cart_items",
      underscored: true,
    }
  );
  return CartItem;
};
