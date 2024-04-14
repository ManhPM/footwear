'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Invoice_details', [
      {
        id_invoice: 1,
        id_item_detail: 1,
        quantity: 1,
        unit_price: 750000,
      },
      {
        id_invoice: 1,
        id_item_detail: 4,
        quantity: 1,
        unit_price: 1000000,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
