'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tbl_user.init({
    name_user: DataTypes.STRING,
    sex: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    real_password: DataTypes.STRING,
    role_id: DataTypes.STRING,
    accesstoken: DataTypes.TEXT,
    refreshtoken: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'tbl_user',
  });
  return tbl_user;
};