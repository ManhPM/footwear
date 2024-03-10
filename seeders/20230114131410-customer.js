"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Customers", [
      {
        id_account: 1,
        name: "Phạm Mạnh Minh",
        phone: "0854872448",
        image: "https://i.pinimg.com/564x/24/21/85/242185eaef43192fc3f9646932fe3b46.jpg",
      },
      {
        id_account: 2,
        name: "Lý Nghĩa Nam",
        phone: "0977751424",
        image: "https://i.pinimg.com/564x/24/21/85/242185eaef43192fc3f9646932fe3b46.jpg",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
