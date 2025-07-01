'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('prodetails', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            prouduct_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id'
                }
            },
            size_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'sizes',
                    key: 'id'
                }
            },
            store_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'stores',
                    key: 'id'
                }
            },
            buyturn: {
                type: Sequelize.INTEGER
            },
            specification: {
                type: Sequelize.TEXT
            },
            price: {
                type: Sequelize.INTEGER
            },
            oldprice: {
                type: Sequelize.INTEGER
            },
            quantity: {
                type: Sequelize.INTEGER
            },
            img1: {
                type: Sequelize.TEXT
            },
            img2: {
                type: Sequelize.TEXT
            },
            img3: {
                type: Sequelize.TEXT
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('prodetails');
    }
};
