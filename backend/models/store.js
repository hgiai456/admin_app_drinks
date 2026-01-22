import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Store extends Model {
    static associate(models) {
      Store.hasMany(models.ProDetail, {
        foreignKey: "store_id",
      });
    }
  }
  Store.init(
    {
      storeName: DataTypes.STRING,
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      image: DataTypes.STRING,
      openTime: DataTypes.TIME,
      closeTime: DataTypes.TIME,
    },
    {
      sequelize,
      modelName: "Store",
      tableName: "stores",
    },
  );
  return Store;
};
