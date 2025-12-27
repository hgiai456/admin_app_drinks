'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('payments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            order_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'orders',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            payment_method: {
                type: Sequelize.ENUM('cod', 'payos', 'vnpay', 'momo'),
                allowNull: false,
                defaultValue: 'cod'
            },
            amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled'),
                allowNull: false,
                defaultValue: 'pending'
            },
            transaction_id: {
                type: Sequelize.STRING(255),
                allowNull: true,
                unique: true
            },
            payment_url: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            payos_order_code: {
                type: Sequelize.BIGINT,
                allowNull: true,
                unique: true
            },
            callback_data: {
                type: Sequelize.JSON,
                allowNull: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });

        // Thêm indexes
        await queryInterface.addIndex('payments', ['order_id'], {
            name: 'idx_payments_order_id'
        });
        
        await queryInterface.addIndex('payments', ['transaction_id'], {
            name: 'idx_payments_transaction_id'
        });
        
        await queryInterface.addIndex('payments', ['payos_order_code'], {
            name: 'idx_payments_payos_order_code'
        });
        
        await queryInterface.addIndex('payments', ['status'], {
            name: 'idx_payments_status'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('payments');
    }
};