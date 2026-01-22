'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('stores', 'image', {
            type: Sequelize.STRING(255),
            allowNull: true,
            defaultValue: null
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('stores', 'image');
    }
};
