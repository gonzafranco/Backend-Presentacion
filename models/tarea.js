const sequelize= require('../database/database');

const {DataTypes} = require('sequelize');


const Tarea = sequelize.define(
    "tarea",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cuerpo: {
        type: DataTypes.STRING,
      },
      finalizado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    }
  );

  module.exports = Tarea;