'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Item_statuses', [
      {
        id_status: 1,
        name: 'Còn hàng',
      },
      {
        id_status: 2,
        name: 'Hết hàng',
      },
      {
        id_status: 3,
        name: 'Ngừng kinh doanh',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
