'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Payment_methods', [
      {
        id_payment_method: 1,
        name: 'Ví điện tử VNPAY',
        status: 1,
      },
      {
        id_payment_method: 2,
        name: 'Thanh toán khi nhận hàng',
        status: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
