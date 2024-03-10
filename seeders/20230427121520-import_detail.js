"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Import_details", [
      { id_item: 1, id_import: 1, quantity: 50, unit_price: 300000 },
      { id_item: 2, id_import: 1, quantity: 50, unit_price: 300000 },
      { id_item: 3, id_import: 1, quantity: 50, unit_price: 300000 },
      { id_item: 4, id_import: 1, quantity: 50, unit_price: 300000 },
      { id_item: 5, id_import: 1, quantity: 50, unit_price: 300000 },
      { id_item: 6, id_import: 1, quantity: 50, unit_price: 300000 },
      { id_item: 7, id_import: 1, quantity: 50, unit_price: 300000 },
      { id_item: 8, id_import: 1, quantity: 50, unit_price: 300000 },
      { id_item: 9, id_import: 1, quantity: 50, unit_price: 300000 },
      { id_item: 10, id_import: 1, quantity: 50, unit_price: 300000 },
      { id_item: 11, id_import: 1, quantity: 50, unit_price: 300000 },
      { id_item: 12, id_import: 1, quantity: 50, unit_price: 300000 },
      { id_item: 13, id_import: 1, quantity: 50, unit_price: 300000 },
      { id_item: 14, id_import: 1, quantity: 50, unit_price: 300000 },
      { id_item: 15, id_import: 1, quantity: 50, unit_price: 300000 },
      { id_item: 16, id_import: 1, quantity: 50, unit_price: 300000 },
      { id_item: 17, id_import: 1, quantity: 50, unit_price: 300000 },
      { id_item: 18, id_import: 1, quantity: 50, unit_price: 300000 },
      { id_item: 19, id_import: 1, quantity: 50, unit_price: 300000 },
      { id_item: 20, id_import: 1, quantity: 50, unit_price: 300000 },
      { id_item: 21, id_import: 1, quantity: 50, unit_price: 300000 },
      { id_item: 22, id_import: 1, quantity: 50, unit_price: 300000 },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
