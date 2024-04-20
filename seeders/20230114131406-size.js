'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Sizes', [
      {
        id_size: 37,
        name: 'Size 37',
        status: 1,
      },
      {
        id_size: 38,
        name: 'Size 38',
        status: 1,
      },
      {
        id_size: 39,
        name: 'Size 39',
        status: 1,
      },
      {
        id_size: 40,
        name: 'Size 40',
        status: 1,
      },
      {
        id_size: 41,
        name: 'Size 41',
        status: 1,
      },
      {
        id_size: 42,
        name: 'Size 42',
        status: 1,
      },
      {
        id_size: 43,
        name: 'Size 43',
        status: 1,
      },
      {
        id_size: 44,
        name: 'Size 44',
        status: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
