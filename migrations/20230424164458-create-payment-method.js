"use strict";
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Payment_methods", {
    id_payment: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Payment_methods");
}
