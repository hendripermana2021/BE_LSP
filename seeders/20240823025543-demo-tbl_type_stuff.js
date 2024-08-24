"use strict";

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcrypt");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "tbl_type_stuffs",
      [
        {
          name_type: "Komputer",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name_type: "Gadget",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_type_stuffs", null, {});
  },
};
