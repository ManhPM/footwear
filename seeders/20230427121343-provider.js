'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Providers', [
      {
        name: 'Công ty Cổ Phần Giày Việt',
        address:
          'Số 21 đường Bùi Thị Xuân, Phường Bến Thành, Quận 1, Tp Hồ Chí Minh (TPHCM)',
        phone: '0286291024',
        status: 1,
      },
      {
        name: 'Công ty Cổ Phần Giày Sài Gòn (SSC)',
        address:
          'Phòng 3C, tầng 3, 157 – 159 đường Xuân Hồng, phường 12, quận Tân Bình – Thành Phố Hồ Chí Minh',
        phone: '0976234380',
        status: 1,
      },
      {
        name: 'Công Ty TNHH Tỷ Xuân (Vinh Long Footwear)',
        address:
          'Số 105, Lô CN6, Cụm CN Vừa Và Nhỏ Từ Liêm, Phường Minh Khai, Quận Bắc Từ Liêm, Hà Nội, Việt Nam',
        phone: '0243765699',
        status: 1,
      },
      {
        name: 'Công ty Cổ phần Quốc tế Sahara',
        address:
          'Số 375, Lô CN6, Cụm CN Vừa Và Nhỏ Từ Liêm, Phường Minh Khai, Quận Bắc Từ Liêm, Hà Nội, Việt Nam',
        phone: '0243765695',
        status: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
