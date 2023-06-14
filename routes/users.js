var express = require("express");
var router = express.Router();

const tareacontroller = require('../controller/tareacontroller');
const autController = require('../controller/auth-controller')

//usuario acepta tareas, las pasa de estado, ve sus tareas
router.get("/tarea/mias", [autController.verifyToken, autController.esUsuarioRuta], tareacontroller.misTareas);

router.get("/tareas", [autController.verifyToken, autController.esUsuarioRuta], tareacontroller.getTareas);
router.get("/tarea/:id", [autController.verifyToken, autController.esUsuarioRuta], tareacontroller.getTarea);
router.post("/tarea/crear", [autController.verifyToken, autController.esUsuarioRuta], tareacontroller.createTarea);
router.put("/tarea/actualizar/:id", [autController.verifyToken, autController.esUsuarioRuta], tareacontroller.updateTarea);
router.delete("/tarea/borrar/:id", [autController.verifyToken, autController.esUsuarioRuta], tareacontroller.deleteTarea);
router.post("/tarea/estado/:id_tarea", [autController.verifyToken, autController.esUsuarioRuta], tareacontroller.cambiarEstadoTarea);


module.exports = router;
