'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Types', [
      {
        name: 'Sneakers',
        status: 1,
      },
      {
        name: 'Sandals',
        status: 1,
      },
      {
        name: 'Boots',
        status: 1,
      },
      {
        name: 'Flats',
        status: 1,
      },
      {
        name: 'Running Shoes',
        status: 1,
      },
      {
        name: 'High Heels',
        status: 1,
      },
      {
        name: 'Espadrilles',
        status: 1,
      },
      {
        name: 'Flip Flops',
        status: 1,
      },
      {
        name: 'Loafers',
        status: 1,
      },
      {
        name: 'Ankle Boots',
        status: 1,
      },
      {
        name: 'Loafers',
        status: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
