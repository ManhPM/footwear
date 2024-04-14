'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Carts', [
      {
        id_item_detail: 1,
        id_customer: 2,
        quantity: 1,
      },
      {
        id_item_detail: 7,
        id_customer: 2,
        quantity: 1,
      },
      {
        id_item_detail: 13,
        id_customer: 2,
        quantity: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
