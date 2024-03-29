'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Accounts', [
      {
        password:
          '$2a$10$pVN6f.l9WXqsQxifG89kTOewLKmN6BxXjFoqIUra5MIBcc6Z8yhtW',
        status: 1,
        id_role: 1,
        email: 'phammanhbeo2001@gmail.com',
      },
      {
        password:
          '$2a$10$pVN6f.l9WXqsQxifG89kTOewLKmN6BxXjFoqIUra5MIBcc6Z8yhtW',
        status: 1,
        id_role: 1,
        email: 'nguyenvana@gmail.com',
      },
      {
        password:
          '$2a$10$pVN6f.l9WXqsQxifG89kTOewLKmN6BxXjFoqIUra5MIBcc6Z8yhtW',
        status: 1,
        id_role: 3,
        email: 'admin@gmail.com',
      },
      {
        password:
          '$2a$10$pVN6f.l9WXqsQxifG89kTOewLKmN6BxXjFoqIUra5MIBcc6Z8yhtW',
        status: 1,
        id_role: 2,
        email: 'nhanvien@gmail.com',
      },
      {
        password:
          '$2a$10$pVN6f.l9WXqsQxifG89kTOewLKmN6BxXjFoqIUra5MIBcc6Z8yhtW',
        status: 1,
        id_role: 1,
        email: 'khachmuataiquan@gmail.com',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
