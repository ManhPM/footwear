"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Invoice_details", [
      {
        id_invoice: 1,
        id_item: 1,
        quantity: 1,
        reviewed: 1,
        unit_price: 2500000
      },
      {
        id_invoice: 1,
        id_item: 2,
        quantity: 1,
        reviewed: 1,
        unit_price: 350000
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
