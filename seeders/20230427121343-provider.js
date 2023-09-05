"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Providers", [
      {
        name: "FUJIBOOKS",
        address:
          "Số 135/17/63 Đường Nguyễn Hữu Cảnh, P. 22, Q. Bình Thạnh, Tp. Hồ Chí Minh (TPHCM)",
        phone: "0908261003",
      },
      {
        name: "Nhà Xuất Bản Kim Đồng",
        address:
          "Số 21 đường Bùi Thị Xuân, Phường Bến Thành, Quận 1, Tp Hồ Chí Minh (TPHCM)",
        phone: "0286291024",
      },
      {
        name: "Đinh Tị",
        address:
          "Phòng 3C, tầng 3, 157 – 159 đường Xuân Hồng, phường 12, quận Tân Bình – Thành Phố Hồ Chí Minh",
        phone: "0976234380",
      },
      {
        name: "Megabook",
        address:
          "Số 105, Lô CN6, Cụm CN Vừa Và Nhỏ Từ Liêm, Phường Minh Khai, Quận Bắc Từ Liêm, Hà Nội, Việt Nam",
        phone: "0243765699",
      },
      {
        name: "Cty Văn Hoá & Truyền Thông Liên Việt",
        address:
          "Số 375, Lô CN6, Cụm CN Vừa Và Nhỏ Từ Liêm, Phường Minh Khai, Quận Bắc Từ Liêm, Hà Nội, Việt Nam",
        phone: "0243765695",
      },
      {
        name: "ZenBooks",
        address:
          "Số 410, Lô CN6, Cụm CN Vừa Và Nhỏ Từ Liêm, Phường Minh Khai, Quận Bắc Từ Liêm, Hà Nội, Việt Nam",
        phone: "0243765696",
      },
      {
        name: "1980 Books",
        address:
          "Số 213, Lô CN6, Cụm CN Vừa Và Nhỏ Từ Liêm, Phường Minh Khai, Quận Bắc Từ Liêm, Hà Nội, Việt Nam",
        phone: "0243765697",
      },
      {
        name: "Bách Việt",
        address:
          "Số 123, Lô CN6, Cụm CN Vừa Và Nhỏ Từ Liêm, Phường Minh Khai, Quận Bắc Từ Liêm, Hà Nội, Việt Nam",
        phone: "0243765698",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
