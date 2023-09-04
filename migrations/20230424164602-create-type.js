"use strict";
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Types", {
    id_type: {
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
  await queryInterface.dropTable("Types");
}
