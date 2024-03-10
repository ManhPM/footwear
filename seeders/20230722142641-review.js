"use strict";
const date = new Date();
date.setHours(date.getHours() + 7);
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Reviews", [
      { id_customer: 2, id_item: 1, rating: 4, datetime: "2024-03-06" },
      { id_customer: 1, id_item: 1, rating: 5, datetime: "2024-03-07" },
      { id_customer: 2, id_item: 1, rating: 5, datetime: "2024-03-08" },
      { id_customer: 1, id_item: 1, rating: 3, datetime: "2024-03-09" },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
