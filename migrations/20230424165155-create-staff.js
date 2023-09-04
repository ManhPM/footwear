"use strict";
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Staffs", {
    id_staff: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    id_store: {
      type: Sequelize.INTEGER,
      references: { model: "Stores", key: "id_store" },
      allowNull: false,
    },
    id_account: {
      type: Sequelize.INTEGER,
      references: { model: "Accounts", key: "id_account" },
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    birthday: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Staffs");
}
