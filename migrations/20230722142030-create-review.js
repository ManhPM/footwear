'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id_item: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'Items', key: 'id_item' },
      },
      id_customer: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'Customers', key: 'id_customer' },
        allowNull: false,
      },
      rating: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      comment: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      datetime: {
        primaryKey: true,
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reviews');
  },
};
