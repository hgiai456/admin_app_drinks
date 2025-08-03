'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Brand extends Model {
        static associate(models) {
            // Một thương hiệu có nhiều sản phẩm
            if (models.Product) {
                Brand.hasMany(models.Product, {
                    foreignKey: 'brand_id',
                    as: 'products'
                });
            }
        }
    }
    Brand.init(
        {
            name: DataTypes.STRING,
            image: DataTypes.TEXT
        },
        {
            sequelize,
            modelName: 'Brand',
            tableName: 'brands'
        }
    );
    return Brand;
};
