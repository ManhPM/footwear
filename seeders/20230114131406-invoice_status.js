'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Invoice_statuses', [
      {
        id_status: 1,
        name: 'Chưa xác nhận',
      },
      {
        id_status: 2,
        name: 'Đã xác nhận',
      },
      {
        id_status: 3,
        name: 'Đã huỷ',
      },
      {
        id_status: 4,
        name: 'Đã giao',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
