"use strict";
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Order_details", {
    id_item: {
      allowNull: false,
      primaryKey: true,
      references: { model: "Items", key: "id_item" },
      type: Sequelize.INTEGER,
    },
    id_order: {
      allowNull: false,
      primaryKey: true,
      references: { model: "Orders", key: "id_order" },
      type: Sequelize.INTEGER,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    reviewed: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Order_details");
}
