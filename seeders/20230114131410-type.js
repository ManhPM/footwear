"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Types", [
      { name: "Tiểu thuyết tình cảm" },
      { name: "Khoa học viễn tưởng" },
      { name: "Huyền bí và giả tưởng" },
      { name: "Văn hóa và xã hội" },
      { name: "Thiếu nhi" },
      { name: "Truyện tranh" },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
