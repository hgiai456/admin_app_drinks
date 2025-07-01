'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class NewsDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            NewsDetail.belongsTo(models.Product, {
                foreignKey: 'product_id'
            });
            NewsDetail.belongsTo(models.News, {
                foreignKey: 'news_id'
            });
        }
    }
    NewsDetail.init(
        {
            product_id: DataTypes.INTEGER,
            news_id: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName: 'NewsDetail',
            tableName: 'newsdetails'
        }
    );
    return NewsDetail;
};
