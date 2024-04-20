'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Invoices', {
      id_invoice: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_customer: {
        type: Sequelize.INTEGER,
        references: { model: 'Customers', key: 'id_customer' },
      },
      id_staff: {
        type: Sequelize.INTEGER,
        references: { model: 'Staffs', key: 'id_staff' },
      },
      id_status: {
        type: Sequelize.INTEGER,
        references: { model: 'Invoice_statuses', key: 'id_status' },
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      datetime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      ship_fee: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      item_fee: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      invoice_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Invoices');
  },
};
