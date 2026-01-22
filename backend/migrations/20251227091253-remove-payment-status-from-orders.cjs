'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
        // Xóa cột payment_status khỏi bảng orders
        await queryInterface.removeColumn('orders', 'payment_status');
        console.log('Removed payment_status column from orders table');
    },

    async down(queryInterface, Sequelize) {
        // Khôi phục lại cột nếu cần rollback
        await queryInterface.addColumn('orders', 'payment_status', {
            type: Sequelize.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending'
        });
    }
};
