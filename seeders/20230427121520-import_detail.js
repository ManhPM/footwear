'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Import_details', [
      { id_item_detail: 1, id_import: 1, quantity: 100, unit_price: 300000 },
      { id_item_detail: 2, id_import: 1, quantity: 100, unit_price: 300000 },
      { id_item_detail: 3, id_import: 1, quantity: 100, unit_price: 300000 },
      { id_item_detail: 4, id_import: 1, quantity: 100, unit_price: 300000 },
      { id_item_detail: 5, id_import: 1, quantity: 100, unit_price: 300000 },
      { id_item_detail: 6, id_import: 1, quantity: 100, unit_price: 300000 },
      { id_item_detail: 7, id_import: 1, quantity: 100, unit_price: 300000 },
      { id_item_detail: 8, id_import: 1, quantity: 100, unit_price: 300000 },
      { id_item_detail: 9, id_import: 1, quantity: 100, unit_price: 300000 },
      { id_item_detail: 10, id_import: 1, quantity: 100, unit_price: 300000 },
      { id_item_detail: 11, id_import: 1, quantity: 100, unit_price: 300000 },
      { id_item_detail: 12, id_import: 1, quantity: 100, unit_price: 300000 },
      { id_item_detail: 13, id_import: 1, quantity: 100, unit_price: 300000 },
      { id_item_detail: 14, id_import: 1, quantity: 100, unit_price: 300000 },
      { id_item_detail: 15, id_import: 1, quantity: 100, unit_price: 300000 },
      { id_item_detail: 16, id_import: 1, quantity: 100, unit_price: 300000 },
      { id_item_detail: 17, id_import: 1, quantity: 100, unit_price: 300000 },
      { id_item_detail: 18, id_import: 1, quantity: 100, unit_price: 300000 },
      { id_item_detail: 19, id_import: 1, quantity: 100, unit_price: 300000 },
      { id_item_detail: 20, id_import: 1, quantity: 100, unit_price: 300000 },
      { id_item_detail: 21, id_import: 1, quantity: 100, unit_price: 300000 },
      { id_item_detail: 22, id_import: 1, quantity: 100, unit_price: 300000 },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
