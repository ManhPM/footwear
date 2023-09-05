"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Import_invoices", [
      {
        id_user: 5,
        id_provider: 1,
        createAt: "2023-08-12",
        status: 1,
        description: "Nhập hàng",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
