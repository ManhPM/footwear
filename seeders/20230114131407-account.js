"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Accounts", [
      {
        password:
          "$2a$10$pVN6f.l9WXqsQxifG89kTOewLKmN6BxXjFoqIUra5MIBcc6Z8yhtW",
        status: 1,
        role: "Khách hàng",
        email: "phammanhbeo2001@gmail.com",
      },
      {
        password:
          "$2a$10$pVN6f.l9WXqsQxifG89kTOewLKmN6BxXjFoqIUra5MIBcc6Z8yhtW",
        status: 1,
        role: "Khách hàng",
        email: "nguyenvana@gmail.com",
      },
      {
        password:
          "$2a$10$pVN6f.l9WXqsQxifG89kTOewLKmN6BxXjFoqIUra5MIBcc6Z8yhtW",
        status: 1,
        role: "Admin",
        email: "admin@gmail.com",
      },
      {
        password:
          "$2a$10$pVN6f.l9WXqsQxifG89kTOewLKmN6BxXjFoqIUra5MIBcc6Z8yhtW",
        status: 1,
        role: "Nhân viên",
        email: "nhanvien@gmail.com",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
