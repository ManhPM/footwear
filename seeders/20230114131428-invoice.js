'use strict';
const date = new Date();
date.setHours(date.getHours() + 7);
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Invoices', [
      {
        id_customer: 1,
        id_staff: 1,
        id_payment_method: 1,
        id_status: 1,
        ship_fee: 25000,
        item_fee: 2850000,
        total: 2875000,
        payment_status: 1,
        description: '',
        datetime: date,
      },
      {
        id_customer: 1,
        id_payment_method: 1,
        id_status: 4,
        ship_fee: 25000,
        item_fee: 2850000,
        total: 2875000,
        payment_status: 1,
        description: '',
        datetime: date,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
