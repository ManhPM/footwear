"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Wishlists", {
      id_user: {
        allowNull: false,
        references: { model: "Users", key: "id_user" },
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_item: {
        type: Sequelize.INTEGER,
        references: { model: "Items", key: "id_item" },
        primaryKey: true,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Wishlists");
  },
};
