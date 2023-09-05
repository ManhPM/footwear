"use strict";
const date = new Date();
date.setHours(date.getHours() + 7);
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Orders", [
      {
        id_user: 1,
        id_payment: 2,
        delivery_fee: 25000,
        item_fee: 305000,
        total: 330000,
        status: 4,
        time_order: date,
      },
      {
        id_user: 1,
        id_payment: 2,
        delivery_fee: 25000,
        item_fee: 305000,
        total: 330000,
        status: 4,
        time_order: date,
      },
      {
        id_user: 1,
        id_payment: 2,
        delivery_fee: 25000,
        item_fee: 305000,
        total: 330000,
        status: 4,
        time_order: date,
      },
      {
        id_user: 1,
        id_payment: 2,
        delivery_fee: 0,
        item_fee: 305000,
        total: 305000,
        status: 4,
        time_order: date,
      },
      {
        id_user: 1,
        id_payment: 2,
        delivery_fee: 0,
        item_fee: 305000,
        total: 305000,
        status: 4,
        time_order: date,
      },
      {
        id_user: 1,
        id_payment: 2,
        delivery_fee: 0,
        item_fee: 305000,
        total: 305000,
        status: 4,
        time_order: date,
      },
      {
        id_user: 1,
        id_payment: 2,
        delivery_fee: 0,
        item_fee: 305000,
        total: 305000,
        status: 4,
        time_order: date,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
