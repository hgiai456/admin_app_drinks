'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('orders', 'payment_status', {
            type: Sequelize.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('orders', 'payment_status');
    }
};
