'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Item_details', {
      id_item_detail: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_item: {
        allowNull: false,
        primaryKey: true,
        references: { model: 'Items', key: 'id_item' },
        type: Sequelize.INTEGER,
      },
      id_size: {
        allowNull: false,
        primaryKey: true,
        references: { model: 'Sizes', key: 'id_size' },
        type: Sequelize.INTEGER,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Item_details');
  },
};
