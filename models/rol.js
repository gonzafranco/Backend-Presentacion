const sequelize= require('../database/database');

const {DataTypes} = require('sequelize');


const Rol = sequelize.define('rol', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false
  });

  module.exports = Rol;