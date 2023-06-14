const Usuario = require("../models/usuario");
const { param } = require("../routes/users");
const httpConst = require('http2').constants;

exports.getUsuarios = async (req, res) => {
    try {
        console.log('entro a usuarios');
        const usuarios = await Usuario.findAll();
        
        console.log('veo usuarios');
        console.log(usuarios);

        console.log('cierro');

        res.status(httpConst.HTTP_STATUS_OK).json(usuarios);
    } catch (error) {
        return res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

exports.getUsuario = async (id) => {
    try {
        const usuario = await Usuario.findOne({ where: { id } });

        if (!usuario) {
            throw new Error('No existe un usuario con el ID proporcionado');
        }

        return usuario;
    } catch (error) {
        throw new Error(`Error al obtener el usuario: ${error.message}`);
    }
};

exports.getUsuarioRuta = async (req, res) => {
    try {
        const id = req.params.usuario_id;

        const usuario = await Usuario.findOne({ where: { id } });

        if (!usuario) {
            return res.status(httpConst.HTTP_STATUS_NOT_FOUND).json({ message: "Usuario no existe" });
        }

        res.json(usuario);
    } catch (error) {
        return res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

exports.updateUsuario = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const { usuario, clave } = req.body;

        const usuario_s = await Usuario.findByPk(usuario_id);
        usuario_s.usuario = usuario;
        usuario_s.clave = clave;
        await usuario_s.save();

        res.status(httpConst.HTTP_STATUS_OK).json(usuario_s);
    } catch (error) {
        return res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

exports.deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        await Usuario.destroy({
            where: {
                id,
            },
        });

        res.status(httpConst.HTTP_STATUS_OK).json({ message: `Usuario con ID ${id} eliminado` });
    } catch (error) {
        return res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};
