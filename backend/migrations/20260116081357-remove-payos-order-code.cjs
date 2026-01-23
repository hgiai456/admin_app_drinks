"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Xóa column payos_order_code
    await queryInterface.removeColumn("payments", "payos_order_code");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("payments", "payos_order_code", {
      type: Sequelize.BIGINT,
      allowNull: true,
      unique: true,
    });
  },
};
