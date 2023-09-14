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
      id_type: {
        type: Sequelize.INTEGER,
        references: { model: "Types", key: "id_type" },
        allowNull: false,
      },
      authorName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      language: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      numberOfVolumes: Sequelize.INTEGER,
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: Sequelize.STRING,
      publicDate: Sequelize.DATE,
      publicComName: Sequelize.STRING,
      style: Sequelize.STRING,
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
