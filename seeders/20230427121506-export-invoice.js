'use strict';

export async function up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Export_invoices", [
      {
        id_staff: 5,
        datetime: "2023-08-12",
        description: "Xuất hàng",
        status: 1,
      },
    ]);
  },

  export async function down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
