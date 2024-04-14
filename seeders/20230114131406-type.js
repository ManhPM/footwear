'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Types', [
      {
        name: 'Sneakers',
      },
      {
        name: 'Sandals',
      },
      {
        name: 'Boots',
      },
      {
        name: 'Flats',
      },
      {
        name: 'Running Shoes',
      },
      {
        name: 'High Heels',
      },
      {
        name: 'Espadrilles',
      },
      {
        name: 'Flip Flops',
      },
      {
        name: 'Loafers',
      },
      {
        name: 'Ankle Boots',
      },
      {
        name: 'Loafers',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
