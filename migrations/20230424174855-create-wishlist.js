"use strict";
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Wishlists", {
    id_wishlist: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    id_customer: {
      type: Sequelize.INTEGER,
      references: { model: "Customers", key: "id_customer" },
      allowNull: false,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Wishlists");
}
