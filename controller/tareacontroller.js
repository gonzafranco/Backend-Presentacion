const Tarea = require("../models/tarea");
const Usuario = require("../models/usuario");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");

const athController = require('../controller/auth-controller')
const usuarioController = require("../controller/usuariocontroller");

const httpConst = require('http2').constants;

exports.getTareas = async (req, res) => {
  try {
    const Tareas = await Tarea.findAll();

    if (!Tareas) {
      res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'no hay tareas' });
    }

    res.status(httpConst.HTTP_STATUS_OK).json(Tareas);
  } catch (error) {
    return res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

exports.getTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const tarea = await Tarea.findOne({ where: { id } });

    if (!tarea) {
      return res.status(httpConst.HTTP_STATUS_NOT_FOUND).json({ message: "Tarea no existe" });
    }
    res.json(tarea);
  } catch (error) {
    return res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

exports.createTarea = async (req, res) => {
  try {
    const { cuerpo, usuarioId } = req.body;
    const busqueda = Usuario.findOne({ where: { usuarioId } });

    if (busqueda) {
      const newTarea = await Tarea.create({
        cuerpo,
        usuarioId,
      });
      res.json(newTarea);
    }
  } catch (error) {
    return res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

exports.updateTarea = async (req, res) => {
  try {
    const { id } = req.params;

    const { cuerpo } = req.body;

    const cuerpo_s = await Tarea.findByPk(id);
    cuerpo_s.cuerpo = cuerpo;

    await cuerpo_s.save();

    res.status(httpConst.HTTP_STATUS_OK).json(cuerpo_s);
  } catch (error) {
    return res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

exports.deleteTarea = async (req, res) => {
  try {
    const { id } = req.params;

    await Tarea.destroy({
      where: {
        id,
      },
    });
    res.json({ message: `Tarea con id ${id} eliminado` });
    res.sendStatus(httpConst.HTTP_STATUS_NO_CONTENT);
  } catch (error) {
    return res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

exports.asignaTarea = async (req, res) => {
  try {
    const usuarioId = req.params.usuario_id;
    const tareaId = req.params.tarea_id;

    const usuarioAsignaTarea = await usuarioController.getUsuario(usuarioId);

    if (!usuarioAsignaTarea) {
      return res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: "No se encontró el usuario" });
    }

    await usuarioAsignaTarea.addTarea(tareaId);

    res
      .status(httpConst.HTTP_STATUS_OK)
      .json({ message: "ID de tarea asignado al usuario con éxito" });
  } catch (error) {
    return res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

exports.misTareas = async (req, res) => {
  const token = req.header("auth-token");
  let tokenDecode = jwt_decode(token);

  try {
    const tareas = await Tarea.findAll({
      where: { usuarioId: tokenDecode.id },
    });

    if (!tareas) {
      return res.status(httpConst.HTTP_STATUS_NOT_FOUND).json({ message: "no hay tarea/s" });
    }
    res.json(tareas);
  } catch (error) {
    return res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};


exports.otenerTareasAcargo = async (req, res) => {
  const token = req.header("auth-token");
  let tokenDecode = jwt_decode(token);

  try {
    const TareasSinAsignar = await Tarea.findAll({ where: { usuarioId: null } });
    if (!TareasSinAsignar) {
      res.status(httpConst.HTTP_STATUS_OK).json({ message: 'no hay tareas sin asignar' });
    }

    if (athController.esAdmin(tokenDecode.rol)) {
      // Lógica para administradores
      res.status(httpConst.HTTP_STATUS_OK);
    }

    if (athController.esJefe(tokenDecode.rol)) {
      // Lógica para jefes
      res.status(httpConst.HTTP_STATUS_OK);
    }

    res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'no se pudo devolver los acargo' });
  } catch (error) {
    return res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};


exports.cambiarEstadoTarea = async (req, res) => {
  const id_tarea = req.params.id_tarea;
  const estado = req.body.estado;

  try {
    const tarea = await Tarea.findOne({ where: { id: id_tarea } });

    if (!tarea) {
      return res.status(httpConst.HTTP_STATUS_NOT_FOUND).json({ message: "Tarea no existe" });
    }

    tarea.finalizado = estado; // Cambiar el estado de la tarea según el valor proporcionado

    await tarea.save(); // Guardar los cambios en la base de datos

    return res.status(httpConst.HTTP_STATUS_OK).json({ message: "Estado de tarea cambiado exitosamente" });
  } catch (error) {
    return res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}
