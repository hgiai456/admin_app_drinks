'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Banner extends Model {
        static associate(models) {
            if (models.BannerDetail) {
                Banner.hasMany(models.BannerDetail, {
                    foreignKey: 'banner_id',
                    as: 'banner_details'
                });
            }
        }
    }
    Banner.init(
        {
            name: DataTypes.STRING,
            image: DataTypes.TEXT,
            status: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName: 'Banner',
            tableName: 'banners'
        }
    );
    return Banner;
};
