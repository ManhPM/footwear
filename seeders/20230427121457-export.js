'use strict';
const date = new Date();
date.setHours(date.getHours() + 7);
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Exports', [
      {
        id_staff: 2,
        datetime: date,
        status: 1,
        description: 'Xuất hàng',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
