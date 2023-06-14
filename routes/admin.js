const express = require("express");
const router = express.Router();

const tareaController = require('../controller/tareacontroller');
const usuarioController = require("../controller/usuariocontroller");
const authController = require("../controller/auth-controller");
const rolController = require('../controller/rolcontroller');

// Rutas de administración de usuarios
router.get("/usuarios", [authController.verifyToken, authController.esAdminRuta], usuarioController.getUsuarios);
router.get("/usuario/:usuario_id", [authController.verifyToken, authController.esAdminRuta], usuarioController.getUsuarioRuta);
router.put("/usuario/actualizar/:usuario_id", [authController.verifyToken, authController.esAdminRuta], usuarioController.updateUsuario);
router.delete("/usuario/borrar/:usuario_id", [authController.verifyToken, authController.esAdminRuta], usuarioController.deleteUsuario);

// Rutas de actualización y eliminación de roles del usuario
router.get("/usuario/rol/actualizar/:usuario_id", [authController.verifyToken, authController.esAdminRuta], rolController.getRolesRutas);
router.put("/usuario/rol/actualizar/:usuario_id", [authController.verifyToken, authController.esAdminRuta], rolController.updateRol);

// Rutas relacionadas con las tareas
router.get("/tareas", [authController.verifyToken, authController.esAdminRuta], tareaController.getTareas);
router.get("/tarea/:id", [authController.verifyToken, authController.esAdminRuta], tareaController.getTarea);
router.post("/tarea/crear", [authController.verifyToken, authController.esAdminRuta], tareaController.createTarea);
router.put("/tarea/actualizar/:id", [authController.verifyToken, authController.esAdminRuta], tareaController.updateTarea);
router.delete("/tarea/borrar/:id", [authController.verifyToken, authController.esAdminRuta], tareaController.deleteTarea);
router.post("/tarea/estado/:id_tarea", [authController.verifyToken, authController.esAdminRuta], tareaController.cambiarEstadoTarea);

// Obtener tareas sin asignar y filtrar si el usuario es jefe por las tareas que tiene a cargo
// router.get("/tarea/obtener-a-cargo", [authController.verifyToken, authController.esAdminRuta], tareaController.obtenerTareasACargo);

// Ruta para asignar una tarea a un usuario
// router.post("/tarea/asignar/:usuario_id/:tarea_id", [authController.verifyToken, authController.esAdminRuta], tareaController.asignarTarea);

// Ruta para obtener las tareas de un usuario
router.get("/tarea/mias", [authController.verifyToken, authController.esAdminRuta], tareaController.misTareas);

module.exports = router;
