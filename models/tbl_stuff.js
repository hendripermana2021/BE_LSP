'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_stuff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tbl_stuff.init({
    name_stuff: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    price: DataTypes.DOUBLE,
    type_stuff: DataTypes.INTEGER,
    disc: DataTypes.DOUBLE,
    user_id: DataTypes.INTEGER,
    image: DataTypes.STRING,
    qty: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tbl_stuff',
  });
  return tbl_stuff;
};