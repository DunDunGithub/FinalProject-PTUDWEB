'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tuyenduong extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tuyenduong.hasMany(models.chuyenxe,{
        foreignKey: 'matuyenduong'
      })
    }
  }
  Tuyenduong.init({
    matuyenduong: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    tinhbatdau : DataTypes.STRING,
    tinhketthuc : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tuyenduong',
    freezeTableName:true
  });
  return Tuyenduong;
};