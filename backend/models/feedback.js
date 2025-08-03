'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class FeedBack extends Model {
        static associate(models) {
            if (models.Product) {
                FeedBack.belongsTo(models.Product, {
                    foreignKey: 'product_id',
                    as: 'product'
                });
            }
            if (models.User) {
                FeedBack.belongsTo(models.User, {
                    foreignKey: 'user_id',
                    as: 'user'
                });
            }
        }
    }
    FeedBack.init(
        {
            product_id: DataTypes.INTEGER,
            user_id: DataTypes.INTEGER,
            content: DataTypes.TEXT,
            star: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName: 'FeedBack',
            tableName: 'feedbacks'
        }
    );
    return FeedBack;
};
