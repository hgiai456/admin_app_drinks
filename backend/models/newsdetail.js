'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class NewsDetail extends Model {
        static associate(models) {
            if (models.Product) {
                NewsDetail.belongsTo(models.Product, {
                    foreignKey: 'product_id',
                    as: 'product'
                });
            }
            if (models.News) {
                NewsDetail.belongsTo(models.News, {
                    foreignKey: 'news_id',
                    as: 'news'
                });
            }
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
            tableName: 'news_details'
        }
    );
    return NewsDetail;
};
