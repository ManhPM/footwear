'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Brands', [
      {
        id_brand: 1,
        name: 'Nike',
        status: 1,
      },
      {
        id_brand: 2,
        name: 'Adidas',
        status: 1,
      },
      {
        id_brand: 3,
        name: 'Puma',
        status: 1,
      },
      {
        id_brand: 4,
        name: 'Reebok',
        status: 1,
      },
      {
        id_brand: 5,
        name: 'New Balance',
        status: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
