"use strict";

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcrypt");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "tbl_stuffs",
      [
        {
          name_stuff: "HP GAMING OMEN",
          price: 8000000,
          type_stuff: "1",
          disc: 10,
          user_id: "1",
          image: "1",
          qty: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name_stuff: "LENOVO GAMING PREDATOR",
          price: 12000000,
          type_stuff: "1",
          disc: 10,
          user_id: "1",
          image: "1",
          qty: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_stuffs", null, {});
  },
};
