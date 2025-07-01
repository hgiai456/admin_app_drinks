'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ProDetail.belongsTo(models.Product, {
                foreignKey: 'product_id'
            });
            ProDetail.belongsTo(models.Size, {
                foreignKey: 'size_id'
            });

            ProDetail.hasMany(models.OrderDetail, {
                foreignKey: 'product_detail_id'
            });
            ProDetail.belongsTo(models.Store, {
                foreignKey: 'store_id'
            });
        }
    }
    ProDetail.init(
        {
            name: DataTypes.TEXT,
            product_id: DataTypes.INTEGER,
            size_id: DataTypes.INTEGER,
            store_id: DataTypes.INTEGER,
            buyturn: DataTypes.INTEGER,
            specification: DataTypes.TEXT,
            price: DataTypes.INTEGER,
            oldprice: DataTypes.INTEGER,
            quantity: DataTypes.INTEGER,
            img1: DataTypes.TEXT,
            img2: DataTypes.TEXT,
            img3: DataTypes.TEXT
        },
        {
            sequelize,
            modelName: 'ProDetail',
            tableName: 'prodetails'
        }
    );
    return ProDetail;
};
