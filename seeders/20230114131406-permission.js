'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Permissions', [
      {
        name: 'show-provider',
      },
      {
        name: 'show-detail-provider',
      },
      {
        name: 'create-provider',
      },
      {
        name: 'update-provider',
      },
      {
        name: 'delete-provider',
      },
      {
        name: 'create-brand',
      },
      {
        name: 'update-brand',
      },
      {
        name: 'delete-brand',
      },
      {
        name: 'create-origin',
      },
      {
        name: 'update-origin',
      },
      {
        name: 'delete-origin',
      },
      {
        name: 'create-material',
      },
      {
        name: 'update-material',
      },
      {
        name: 'delete-material',
      },
      {
        name: 'create-type',
      },
      {
        name: 'update-type',
      },
      {
        name: 'delete-type',
      },
      {
        name: 'create-size',
      },
      {
        name: 'update-size',
      },
      {
        name: 'delete-size',
      },
      {
        name: 'create-payment-method',
      },
      {
        name: 'update-payment-method',
      },
      {
        name: 'delete-payment-method',
      },
      {
        name: 'show-staff',
      },
      {
        name: 'show-detail-staff',
      },
      {
        name: 'create-staff',
      },
      {
        name: 'update-staff',
      },
      {
        name: 'delete-staff',
      },
      {
        name: 'checkout',
      },
      {
        name: 'add-to-cart',
      },
      {
        name: 'change-quantity-cart',
      },
      {
        name: 'remove-from-cart',
      },
      {
        name: 'show-cart',
      },
      {
        name: 'show-import',
      },
      {
        name: 'show-detail-import',
      },
      {
        name: 'show-item-import',
      },
      {
        name: 'create-import',
      },
      {
        name: 'update-import',
      },
      {
        name: 'complete-import',
      },
      {
        name: 'delete-import',
      },
      {
        name: 'show-import-detail',
      },
      {
        name: 'create-import-detail',
      },
      {
        name: 'update-import-detail',
      },
      {
        name: 'delete-import-detail',
      },
      {
        name: 'show-current-invoice',
      },
      {
        name: 'confirm-invoice',
      },
      {
        name: 'complete-invoice',
      },
      {
        name: 'cancel-invoice',
      },
      {
        name: 'statistic',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
