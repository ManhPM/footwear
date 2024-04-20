'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Items', {
      id_item: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_type: {
        type: Sequelize.INTEGER,
        references: { model: 'Types', key: 'id_type' },
      },
      id_origin: {
        type: Sequelize.INTEGER,
        references: { model: 'Origins', key: 'id_origin' },
      },
      id_material: {
        type: Sequelize.INTEGER,
        references: { model: 'Materials', key: 'id_material' },
      },
      id_brand: {
        type: Sequelize.INTEGER,
        references: { model: 'Brands', key: 'id_brand' },
      },
      id_status: {
        type: Sequelize.INTEGER,
        references: { model: 'Item_statuses', key: 'id_status' },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: Sequelize.STRING,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Items');
  },
};
