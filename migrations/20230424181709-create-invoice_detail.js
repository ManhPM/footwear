'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Invoice_details', {
      id_item_detail: {
        allowNull: false,
        primaryKey: true,
        references: { model: 'Item_details', key: 'id_item_detail' },
        type: Sequelize.INTEGER,
      },
      id_invoice: {
        allowNull: false,
        primaryKey: true,
        references: { model: 'Invoices', key: 'id_invoice' },
        type: Sequelize.INTEGER,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      unit_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Invoice_details');
  },
};
