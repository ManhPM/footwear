'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Export_details', {
      id_item: {
        allowNull: false,
        primaryKey: true,
        references: { model: 'Items', key: 'id_item' },
        type: Sequelize.INTEGER,
      },
      id_export: {
        allowNull: false,
        primaryKey: true,
        references: { model: 'Exports', key: 'id_export' },
        type: Sequelize.INTEGER,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      unit_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Export_details');
  },
};
