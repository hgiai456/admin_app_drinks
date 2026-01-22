'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('orders', 'session_id', {
            type: Sequelize.STRING(255),
            allowNull: true,
            defaultValue: null
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('orders', 'session_id');
    }
};
