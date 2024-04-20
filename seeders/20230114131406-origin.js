'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Origins', [
      {
        id_origin: 1,
        name: 'Việt Nam',
        status: 1,
      },
      {
        id_origin: 2,
        name: 'Trung Quốc',
        status: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
