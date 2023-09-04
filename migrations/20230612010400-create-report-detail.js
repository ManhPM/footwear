"use strict";
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Report_details", {
    id_item: {
      allowNull: false,
      primaryKey: true,
      references: { model: "Items", key: "id_item" },
      type: Sequelize.INTEGER,
    },
    id_report: {
      allowNull: false,
      primaryKey: true,
      references: { model: "Reports", key: "id_report" },
      type: Sequelize.INTEGER,
    },
    sold: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    total: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Report_details");
}
