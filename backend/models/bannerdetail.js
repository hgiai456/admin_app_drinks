import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class BannerDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BannerDetail.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });

      BannerDetail.belongsTo(models.Banner, {
        foreignKey: "banner_id", // Sửa lại lỗi gõ nhầm: 'bannner_id'
        as: "banner_details",
      });
    }
  }
  BannerDetail.init(
    {
      product_id: DataTypes.INTEGER,
      banner_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "BannerDetail",
      tableName: "bannerdetails",
    },
  );
  return BannerDetail;
};
