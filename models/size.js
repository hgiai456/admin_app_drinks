'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Size extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Size.hasMany(models.ProDetail, {
                foreignKey: 'size_id'
            });
        }
    }
    Size.init(
        {
            name: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'Size',
            tableName: 'sizes'
        }
    );
    return Size;
};
