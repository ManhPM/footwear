"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Import_invoice_details", {
      id_item: {
        allowNull: false,
        primaryKey: true,
        references: { model: "Items", key: "id_item" },
        type: Sequelize.INTEGER,
      },
      id_i_invoice: {
        allowNull: false,
        primaryKey: true,
        references: { model: "Import_invoices", key: "id_i_invoice" },
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
    await queryInterface.dropTable("Import_invoice_details");
  },
};
