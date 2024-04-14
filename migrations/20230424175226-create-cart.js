'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Carts', {
      id_item_detail: {
        allowNull: false,
        primaryKey: true,
        references: { model: 'Item_details', key: 'id_item_detail' },
        type: Sequelize.INTEGER,
      },
      id_customer: {
        allowNull: false,
        primaryKey: true,
        references: { model: 'Customers', key: 'id_customer' },
        type: Sequelize.INTEGER,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Carts');
  },
};
