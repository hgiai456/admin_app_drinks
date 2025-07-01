'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Banner extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Banner.hasMany(models.BannerDetail, {
                foreignKey: 'banner_id' // Sửa lại lỗi gõ nhầm: 'bannner_id'
            });
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
