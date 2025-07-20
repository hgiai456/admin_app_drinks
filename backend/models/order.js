'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            //Bảng order có khóa phụ user_id từ tham chiếu từ bảng users
            Order.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });

            //Khóa chính của bảng order có khóa phụ order_id trong bảng OrderDetail
            Order.hasMany(models.OrderDetail, {
                foreignKey: 'order_id',
                as: 'order_details' // PHẢI có as này để match với include
            });
        }
    }
    Order.init(
        {
            user_id: DataTypes.INTEGER,
            session_id: DataTypes.TEXT,
            status: DataTypes.INTEGER,
            note: DataTypes.TEXT,
            total: DataTypes.INTEGER,
            address: DataTypes.TEXT,
            phone: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'Order',
            tableName: 'orders'
        }
    );
    return Order;
};
