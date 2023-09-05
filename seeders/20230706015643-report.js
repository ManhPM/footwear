"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Reports", [
      {
        createAt: "2023-08-11",
        countOrder: 3,
        revenue: 1100000,
      },
      {
        createAt: "2023-08-10",
        countOrder: 5,
        revenue: 550000,
      },
      {
        createAt: "2023-08-12",
        countOrder: 10,
        revenue: 660000,
      },
      {
        createAt: "2023-08-11",
        countOrder: 5,
        revenue: 550000,
      },
      {
        createAt: "2023-08-10",
        countOrder: 10,
        revenue: 660000,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
