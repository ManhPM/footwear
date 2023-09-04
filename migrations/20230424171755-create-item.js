"use strict";
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Items", {
    id_item: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    id_type: {
      type: Sequelize.INTEGER,
      references: { model: "Types", key: "id_type" },
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Items");
}
