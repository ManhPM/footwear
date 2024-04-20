'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Materials', [
      {
        id_material: 1,
        name: 'Da',
        status: 1,
      },
      {
        id_material: 2,
        name: 'Vải',
        status: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
