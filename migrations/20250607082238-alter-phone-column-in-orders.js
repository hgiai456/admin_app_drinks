'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Backup dữ liệu (tùy chọn)
        await queryInterface.sequelize.query(`
      CREATE TABLE orders_backup AS SELECT * FROM orders;
    `);

        // Alter column phone từ INTEGER sang STRING
        await queryInterface.changeColumn('orders', 'phone', {
            type: Sequelize.STRING(11),
            allowNull: false
        });

        // Cập nhật dữ liệu hiện có (thêm số 0 đầu nếu cần)
    },

    async down(queryInterface, Sequelize) {
        // Rollback: đổi lại thành INTEGER
        await queryInterface.changeColumn('orders', 'phone', {
            type: Sequelize.INTEGER,
            allowNull: false
        });

        // Xóa backup table
        await queryInterface.dropTable('orders_backup');
    }
};
