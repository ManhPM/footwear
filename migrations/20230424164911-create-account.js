"use strict";
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Accounts", {
    id_account: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
    },
    isActive: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Accounts");
}
