'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_type_stuff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tbl_type_stuff.init({
    name_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tbl_type_stuff',
  });
  return tbl_type_stuff;
};