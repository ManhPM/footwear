"use strict";

export async function up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert("Roles", [
      {
        name: "Khách hàng",
      },
      {
        name: "Quản lý",
      },
      {
        name: "Nhân viên"
      },
      {
        name: "Shipper"
      },
      {
        name: "Admin"
      },
    ]);
  },

  export async function down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
