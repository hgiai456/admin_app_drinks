'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('cart_items', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            cart_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'carts',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            product_detail_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'prodetails',
                    key: 'id'
                }
            },
            quantity: {
                type: Sequelize.INTEGER
            },
            created_at: {
                // Sửa từ createdAt
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                // Sửa từ updatedAt
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('cart_items');
    }
};
