"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Import_invoices", {
      id_i_invoice: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_user: {
        type: Sequelize.INTEGER,
        references: { model: "Users", key: "id_user" },
        allowNull: false,
      },
      id_provider: {
        type: Sequelize.INTEGER,
        references: { model: "Providers", key: "id_provider" },
        allowNull: false,
      },
      createAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Import_invoices");
  },
};
