const Sequelize = require("sequelize");
const sequelize = require("../database/database");


const tarea = require('./tarea')
const rol = require('./rol')



const {DataTypes}=require('sequelize')


const Usuario = sequelize.define('usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
        // validate: {
        //     isEmail: true
        // },
        allowNull: false
   
  },
  clave: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('now')
  }
}, 
{
  timestamps: false
});

Usuario.hasMany(tarea,{
    foreingKey: 'usuarioId',
    sourceKey: 'id'
})

tarea.belongsTo(Usuario,{
    foreignKey:'usuarioId',
    targetKey:'id'
})

const UsuarioRol = sequelize.define('usuario_rol', {},{timestamps:false});

Usuario.belongsToMany(rol, { through: UsuarioRol });
rol.belongsToMany(Usuario, { through: UsuarioRol });



module.exports = Usuario;
