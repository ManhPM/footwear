'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Sizes', [
      {
        id_size: 37,
        name: 'Size 37',
      },
      {
        id_size: 38,
        name: 'Size 38',
      },
      {
        id_size: 39,
        name: 'Size 39',
      },
      {
        id_size: 40,
        name: 'Size 40',
      },
      {
        id_size: 41,
        name: 'Size 41',
      },
      {
        id_size: 42,
        name: 'Size 42',
      },
      {
        id_size: 43,
        name: 'Size 43',
      },
      {
        id_size: 44,
        name: 'Size 44',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
