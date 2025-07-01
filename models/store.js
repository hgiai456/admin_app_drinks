'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Store extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Store.hasMany(models.ProDetail, {
                foreignKey: 'store_id'
            });
        }
    }
    Store.init(
        {
            storeName: DataTypes.STRING,
            address: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            image: DataTypes.STRING,
            openTime: DataTypes.TIME,
            closeTime: DataTypes.TIME
        },
        {
            sequelize,
            modelName: 'Store',
            tableName: 'stores'
        }
    );
    return Store;
};
