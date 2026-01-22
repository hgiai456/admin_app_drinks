"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      "payments",
      "payment_method",
      "payment_method_old"
    );

    await queryInterface.addColumn("payments", "payment_method", {
      type: Sequelize.ENUM("cod", "sepay", "vnpay", "momo"),
      allowNull: false,
      defaultValue: "cod",
    });

    await queryInterface.sequelize.query(`
            UPDATE payments 
            SET payment_method = CASE 
                WHEN payment_method_old = 'payos' THEN 'sepay'
                ELSE payment_method_old
            END
        `);

    // ✅ Bước 4: Xóa cột cũ
    await queryInterface.removeColumn("payments", "payment_method_old");
  },

  async down(queryInterface, Sequelize) {
    // Rollback: Đổi lại thành enum cũ
    await queryInterface.renameColumn(
      "payments",
      "payment_method",
      "payment_method_old"
    );

    await queryInterface.addColumn("payments", "payment_method", {
      type: Sequelize.ENUM("cod", "payos", "vnpay", "momo"),
      allowNull: false,
      defaultValue: "cod",
    });

    await queryInterface.sequelize.query(`
            UPDATE payments 
            SET payment_method = CASE 
                WHEN payment_method_old = 'sepay' THEN 'payos'
                ELSE payment_method_old
            END
        `);

    await queryInterface.removeColumn("payments", "payment_method_old");
  },
};
