"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Account_verifies", {
      id_account: {
        allowNull: false,
        references: { model: "Accounts", key: "id_account" },
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      expire_time: {
        primaryKey: true,
        type: Sequelize.DATE,
        allowNull: false,
      },
      verify_code: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Account_verifies");
  },
};
