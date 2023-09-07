"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        username: "user1",
        password:
          "$2a$10$pVN6f.l9WXqsQxifG89kTOewLKmN6BxXjFoqIUra5MIBcc6Z8yhtW",
        isActive: 1,
        role: "Khách hàng",
        fullName: "Phạm Minh Mạnh",
        email: "phammanhbeo2001@gmail.com",
        phone: "0961592551",
        address: "97 Man Thiện Phường Hiệp Phú Quận 9 TP Thủ Đức",
        image:
          "https://res.cloudinary.com/dpgjnngzt/image/upload/v1692954334/anhdaidien_onsafn.jpg",
      },
      {
        username: "user2",
        password:
          "$2a$10$pVN6f.l9WXqsQxifG89kTOewLKmN6BxXjFoqIUra5MIBcc6Z8yhtW",
        isActive: 1,
        role: "Khách hàng",
        fullName: "Trương Phạm Trí Cường",
        email: "nguyenvana@gmail.com",
        phone: "0912345678",
        address: "123 Đường ABC, Quận XYZ, Thành phố HCM",
        image:
          "https://res.cloudinary.com/dpgjnngzt/image/upload/v1692954334/anhdaidien_onsafn.jpg",
      },
      {
        username: "user3",
        password:
          "$2a$10$pVN6f.l9WXqsQxifG89kTOewLKmN6BxXjFoqIUra5MIBcc6Z8yhtW",
        isActive: 1,
        role: "Khách hàng",
        fullName: "Trần Thị B",
        email: "tranthib@gmail.com",
        phone: "0987654321",
        address: "456 Đường XYZ, Quận ABC, Thành phố Hà Nội",
        image:
          "https://res.cloudinary.com/dpgjnngzt/image/upload/v1692954334/anhdaidien_onsafn.jpg",
      },
      {
        username: "user4",
        password:
          "$2a$10$pVN6f.l9WXqsQxifG89kTOewLKmN6BxXjFoqIUra5MIBcc6Z8yhtW",
        isActive: 1,
        role: "Khách hàng",
        fullName: "Lê Hoàng C",
        email: "lehoangc@gmail.com",
        phone: "0909090909",
        address: "789 Đường DEF, Quận GHI, Thành phố Đà Nẵng",
        image:
          "https://res.cloudinary.com/dpgjnngzt/image/upload/v1692954334/anhdaidien_onsafn.jpg",
      },
      {
        username: "user5",
        password:
          "$2a$10$pVN6f.l9WXqsQxifG89kTOewLKmN6BxXjFoqIUra5MIBcc6Z8yhtW",
        isActive: 1,
        role: "Khách hàng",
        fullName: "Phạm Minh D",
        email: "phamminhd@gmail.com",
        phone: "0977777777",
        address: "321 Đường MNO, Quận PQR, Thành phố Hải Phòng",
        image:
          "https://res.cloudinary.com/dpgjnngzt/image/upload/v1692954334/anhdaidien_onsafn.jpg",
      },
      {
        username: "user6",
        password:
          "$2a$10$pVN6f.l9WXqsQxifG89kTOewLKmN6BxXjFoqIUra5MIBcc6Z8yhtW",
        isActive: 1,
        role: "Khách hàng",
        fullName: "Ngô Thị E",
        email: "ngothienn@gmail.com",
        phone: "0944444444",
        address: "543 Đường STU, Quận VWX, Thành phố Cần Thơ",
        image:
          "https://res.cloudinary.com/dpgjnngzt/image/upload/v1692954334/anhdaidien_onsafn.jpg",
      },
      {
        username: "admin",
        password:
          "$2a$10$pVN6f.l9WXqsQxifG89kTOewLKmN6BxXjFoqIUra5MIBcc6Z8yhtW",
        isActive: 1,
        role: "Admin",
        fullName: "Phạm Minh Mạnh",
        email: "ngothien@gmail.com",
        phone: "0944444444",
        address: "543 Đường STU, Quận VWX, Thành phố Hồ Chí Minh",
        image:
          "https://res.cloudinary.com/dpgjnngzt/image/upload/v1692954334/anhdaidien_onsafn.jpg",
      },
      {
        username: "staff",
        password:
          "$2a$10$pVN6f.l9WXqsQxifG89kTOewLKmN6BxXjFoqIUra5MIBcc6Z8yhtW",
        isActive: 1,
        role: "Nhân viên",
        fullName: "Đỗ Đức Hậu",
        email: "ngothie@gmail.com",
        phone: "0944444444",
        address: "543 Đường STU, Quận VWX, Thành phố Biên Hoà",
        image:
          "https://res.cloudinary.com/dpgjnngzt/image/upload/v1692954334/anhdaidien_onsafn.jpg",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
