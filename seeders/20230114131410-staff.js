"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Staffs", [
      {
        id_account: 3,
        name: "Phạm Minh Mạnh",
        address:
          "123 ABCDE Thành phố Thủ Đức",
        phone: "0999999999",
        status: 1,
      },
      {
        id_account: 4,
        name: "Admin",
        address:
          "123 ABCDE Thành phố Thủ Đức",
        phone: "0888888888",
        status: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
