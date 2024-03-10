'use strict';
const date = new Date();
date.setHours(date.getHours() + 7);
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Imports', [
      {
        id_staff: 2,
        datetime: date,
        status: 1,
        description: 'Nhập hàng',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
