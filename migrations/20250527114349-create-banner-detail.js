'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('bannerdetails', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'products',
                    key: 'id'
                }
            },
            banner_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'banners',
                    key: 'id'
                }
            },
            banner_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'banners',
                    key: 'id'
                }
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
        await queryInterface.dropTable('bannerdetails');
    }
};
