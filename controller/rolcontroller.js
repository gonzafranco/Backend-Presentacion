const Usuario = require("../models/usuario");
const Rol = require("../models/rol");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const usuarioController = require('../controller/usuariocontroller')
const { param } = require("../routes/users");
const httpConst = require('http2').constants;

exports.getRolesRutas = async (req, res) => {
  console.log(req.params.usuario_id);
  const usuarioModificar = req.params.usuario_id;
  try {
    const usuario = await Usuario.findByPk(usuarioModificar);
    const roles = await usuario.getRols({ raw: true });

    res.status(httpConst.HTTP_STATUS_OK).json(roles.map((rol) => rol.nombre));
  } catch (error) {
    console.log(error);
  }
};

//retorna los roles de un usuario no se usa en rutas
exports.getRoles = async (userId) => {
  try {
    const usuario = await Usuario.findByPk(userId);
    const roles = await usuario.getRols({ raw: true });

    return roles.map((rol) => rol.nombre);
  } catch (error) {
    console.log(error);
  }
};

//le paso un usuario y le cambio los roles
//probar
exports.updateRol = async (req, res) => {
  try {
    const id = req.params.usuario_id;
    let rols = '';
    const usuarioModificar = await usuarioController.getUsuario(id);
    console.log('---------------------------------------');
    console.log(usuarioModificar);
    const admin = req.body.admin; // Verificar si la opción 2 fue seleccionada
    const jefe = req.body.jefe;
    //recibir el id a actualizar.
    console.log(admin);
    console.log(jefe);

    if (admin) {
      let rol = await Rol.findByPk(2);

      if (rol) {
        await usuarioModificar.addRol(rol);
      }
      rols = rols + 'agrego admin ';
    }
    if (!admin) {
      let rol = await Rol.findByPk(2);

      if (rol) {
        await usuarioModificar.removeRol(rol);
      }
      rols = rols + 'quito admin ';
    }

    if (jefe) {
      let rol = await Rol.findByPk(3);

      if (rol) {
        await usuarioModificar.addRol(rol);
      }
      rols = rols + 'agrego jefe ';
    }
    if (!jefe) {
      let rol = await Rol.findByPk(3);

      if (rol) {
        await usuarioModificar.removeRol(rol);
      }
      rols = rols + 'quito jefe ';
    }

    res.status(httpConst.HTTP_STATUS_OK).json({ message: 'se modificaron roles: ' + rols });

  } catch (error) {
    return res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};
