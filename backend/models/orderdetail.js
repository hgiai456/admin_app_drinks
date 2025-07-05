'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrderDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            OrderDetail.belongsTo(models.Order, {
                foreignKey: 'order_id'
            });
            OrderDetail.belongsTo(models.ProDetail, {
                foreignKey: 'product_detail_id'
            });
        }
    }
    OrderDetail.init(
        {
            order_id: DataTypes.INTEGER,
            product_detail_id: DataTypes.INTEGER,
            price: DataTypes.INTEGER,
            quantity: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName: 'OrderDetail',
            tableName: 'orderdetails',
            timestamps: true,
            createdAt: 'created_at', // Map createdAt -> created_at
            updatedAt: 'updated_at' // Map updatedAt -> updated_at
        }
    );
    return OrderDetail;
};
