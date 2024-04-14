'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Wishlists', [
      { id_item: 1, id_customer: 1 },
      { id_item: 2, id_customer: 2 },
      { id_item: 3, id_customer: 1 },
      { id_item: 4, id_customer: 2 },
      { id_item: 5, id_customer: 1 },
      { id_item: 6, id_customer: 2 },
      { id_item: 7, id_customer: 1 },
      { id_item: 8, id_customer: 2 },
      { id_item: 10, id_customer: 1 },
      { id_item: 9, id_customer: 2 },
      { id_item: 11, id_customer: 1 },
      { id_item: 12, id_customer: 2 },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
