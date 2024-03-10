"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Items", {
      id_item: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      size: Sequelize.INTEGER,
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: Sequelize.STRING,
      brand: Sequelize.STRING,
      origin: Sequelize.STRING,
      material: Sequelize.STRING,
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Items");
  },
};
