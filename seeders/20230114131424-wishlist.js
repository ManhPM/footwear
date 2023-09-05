"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Wishlists", [
      { id_item: 1, id_user: 1 },
      { id_item: 2, id_user: 2 },
      { id_item: 3, id_user: 1 },
      { id_item: 4, id_user: 2 },
      { id_item: 5, id_user: 1 },
      { id_item: 6, id_user: 2 },
      { id_item: 7, id_user: 1 },
      { id_item: 8, id_user: 2 },
      { id_item: 9, id_user: 1 },
      { id_item: 10, id_user: 2 },
      { id_item: 11, id_user: 1 },
      { id_item: 12, id_user: 2 },
      { id_item: 13, id_user: 1 },
      { id_item: 14, id_user: 2 },
      { id_item: 15, id_user: 1 },
      { id_item: 16, id_user: 2 },
      { id_item: 17, id_user: 1 },
      { id_item: 18, id_user: 2 },
      { id_item: 19, id_user: 1 },
      { id_item: 20, id_user: 2 },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
