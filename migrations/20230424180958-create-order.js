"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_user: {
        type: Sequelize.INTEGER,
        references: { model: "Users", key: "id_user" },
      },
      id_shipper: {
        type: Sequelize.INTEGER,
      },
      id_payment: {
        type: Sequelize.INTEGER,
        references: { model: "Payment_methods", key: "id_payment" },
        allowNull: false,
      },
      time_order: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      time_confirm: {
        type: Sequelize.DATE,
      },
      time_shipper_receive: {
        type: Sequelize.DATE,
      },
      time_shipper_delivered: {
        type: Sequelize.DATE,
      },
      delivery_fee: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      item_fee: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
      },
      description: {
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Orders");
  },
};
