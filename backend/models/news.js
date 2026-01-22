import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class News extends Model {
    static associate(models) {
      if (models.NewsDetail) {
        News.hasMany(models.NewsDetail, {
          foreignKey: "news_id",
          as: "news_details",
        });
      }
    }
  }
  News.init(
    {
      title: DataTypes.STRING,
      image: DataTypes.TEXT,
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "News",
      tableName: "news",
    },
  );
  return News;
};
