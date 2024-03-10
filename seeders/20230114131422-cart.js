"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Carts", [
      {
        id_item: 1,
        id_customer: 1,
        quantity: 1,
      },
      {
        id_item: 7,
        id_customer: 1,
        quantity: 1,
      },
      {
        id_item: 13,
        id_customer: 1,
        quantity: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
