'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Imports', {
      id_import: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_provider: {
        type: Sequelize.INTEGER,
        references: { model: 'Providers', key: 'id_provider' },
        allowNull: false,
      },
      id_staff: {
        type: Sequelize.INTEGER,
        references: { model: 'Staffs', key: 'id_staff' },
        allowNull: false,
      },
      datetime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Imports');
  },
};
