"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Payment_methods", [
      {
        name: "Ví điện tử",
      },
      {
        name: "Thanh toán khi nhận hàng",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
