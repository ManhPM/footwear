'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Accounts', [
      {
        name: 'Khách hàng',
      },
      {
        name: 'Nhân viên',
      },
      {
        name: 'Admin',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
