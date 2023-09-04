"use strict";
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Discounts", {
    code: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING,
    },
    discount_percent: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    min_quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Discounts");
}
