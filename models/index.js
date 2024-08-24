"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.tbl_user = require("../models/tbl_user.js")(sequelize, Sequelize);
db.tbl_stuff = require("../models/tbl_stuff.js")(sequelize, Sequelize);
db.tbl_type_stuff = require("../models/tbl_type_stuff.js")(sequelize, Sequelize);
db.tbl_role = require("../models/tbl_role.js")(sequelize, Sequelize);

//STUFF RELATION
db.tbl_stuff.belongsTo(db.tbl_type_stuff, {
  foreignKey: "type_stuff",
  as: "type",
  targetKey: "id",
});

db.tbl_user.belongsTo(db.tbl_role, {
  foreignKey: "role_id",
  as: "role",
  targetKey: "id",
});
//ASSOCIATE MODUL SISWA
// db.tbl_modul_assignment.hasMany(db.tbl_modul, {
//   foreignKey: "id",
//   as: "modul",
//   sourceKey: "id_modul",
// });


// //ASSOCIATE QUESTION FORM

// db.tbl_test.hasMany(db.tbl_question, {
//   foreignKey: "id_test",
//   as: "question",
//   sourceKey: "id",
// });

// db.tbl_question.hasMany(db.tbl_option, {
//   foreignKey: "id_question",
//   as: "option",
//   sourceKey: "id",
// });

// //--> END ASSOCIATE FORM

// // ASSOCIATE MODUL
// db.tbl_modul.hasMany(db.tbl_reference, {
//   foreignKey: "id_modul",
//   as: "referensi",
//   sourceKey: "id",
// });

// db.tbl_modul.hasMany(db.tbl_modul_content, {
//   foreignKey: "id_modul",
//   as: "content_modul",
//   sourceKey: "id",
// });

// db.tbl_modul.hasMany(db.tbl_readviews, {
//   foreignKey: "id_modul",
//   as: "views",
//   sourceKey: "id",
// });



// //ASSOCIATE GURU
// db.tbl_guru.hasMany(db.tbl_modul, {
//   foreignKey: "id_guru",
//   as: "referensi",
//   sourceKey: "id",
// });

// db.tbl_guru.belongsTo(db.tbl_class, {
//   foreignKey: "id",
//   as: "kelas",
//   targetKey: "id_walkes",
// });

// //ASSOCIATE SISWA
// db.tbl_siswa.belongsTo(db.tbl_class, {
//   foreignKey: "id_class",
//   as: "class",
//   targetKey: "id",
// });

// //ASSOCIATE COONTENT POST
// db.tbl_contentpost.hasMany(db.tbl_reference, {
//   foreignKey: "id_content",
//   as: "refer",
//   sourceKey: "id",
// });

// //ASSOCIATE CLASS
// db.tbl_class.belongsTo(db.tbl_guru, {
//   foreignKey: "id_walkes",
//   as: "wali_kelas",
//   targetKey: "id",
// });

// //ASSOCIATE SISWA
// db.tbl_siswa.belongsTo(db.tbl_class, {
//   foreignKey: "id_class",
//   as: "kelas",
//   targetKey: "id",
// });

module.exports = db;
