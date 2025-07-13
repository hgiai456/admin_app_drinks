'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.hasMany(models.Order, {
                foreignKey: 'user_id'
            });
        }
    }
    User.init(
        {
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            name: DataTypes.STRING,
            role: DataTypes.INTEGER,
            avatar: DataTypes.STRING,
            phone: DataTypes.STRING,
            address: DataTypes.TEXT,
            is_locked: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users'
        }
    );
    return User;
};
