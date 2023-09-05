"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Carts", [
      {
        id_item: 1,
        id_user: 1,
        quantity: 2,
      },
      {
        id_item: 7,
        id_user: 1,
        quantity: 2,
      },
      {
        id_item: 21,
        id_user: 1,
        quantity: 2,
      },
      {
        id_item: 1,
        id_user: 2,
        quantity: 3,
      },
      {
        id_item: 10,
        id_user: 1,
        quantity: 2,
      },
      {
        id_item: 15,
        id_user: 2,
        quantity: 3,
      },
      {
        id_item: 7,
        id_user: 2,
        quantity: 2,
      },
      {
        id_item: 21,
        id_user: 2,
        quantity: 2,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
