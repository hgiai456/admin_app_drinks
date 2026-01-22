import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class NewsDetail extends Model {
    static associate(models) {
      if (models.Product) {
        NewsDetail.belongsTo(models.Product, {
          foreignKey: "product_id",
          as: "product",
        });
      }
      if (models.News) {
        NewsDetail.belongsTo(models.News, {
          foreignKey: "news_id",
          as: "news",
        });
      }
    }
  }
  NewsDetail.init(
    {
      product_id: DataTypes.INTEGER,
      news_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "NewsDetail",
      tableName: "newsdetails", //Đảm bảo trùng với tên bảng trong database
    },
  );
  return NewsDetail;
};
