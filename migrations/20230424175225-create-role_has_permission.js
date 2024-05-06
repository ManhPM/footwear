'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Role_has_permissions', {
      id_role: {
        allowNull: false,
        primaryKey: true,
        references: { model: 'Roles', key: 'id_role' },
        type: Sequelize.INTEGER,
      },
      id_permission: {
        allowNull: false,
        primaryKey: true,
        references: { model: 'Permissions', key: 'id_permission' },
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Role_has_permissions');
  },
};
