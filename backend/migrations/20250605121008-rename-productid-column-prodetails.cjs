module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      "prodetails",
      "prouduct_id",
      "product_id",
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      "prodetails",
      "prouduct_id",
      "product_id",
    );
  },
};
