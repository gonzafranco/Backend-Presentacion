const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const rolesController = require('../controller/rolcontroller');
const users = require("../models/usuario");
const Rol = require("../models/rol");
const httpConst = require('http2').constants;


exports.register = async (req, res) => {
  const { usuario, email, clave, roles } = req.body;

  if (usuario === "" || email === "") {
    return res.status(httpConst.HTTP_STATUS_NOT_FOUND).json({ message: "Por favor rellenar campos" });
  }

  try {
    const usuarioExiste = await users.findOne({ where: { usuario } });

    if (usuarioExiste) {
      return res.status(httpConst.HTTP_STATUS_NOT_FOUND).json({ message: "Usuario existe" });
    }
  } catch (error) {
    return res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: error.message });
  }

  try {
    const isEmailExist = await users.findOne({ where: { email } });
    if (isEmailExist) {
      return res.status(httpConst.HTTP_STATUS_BAD_REQUEST).json({ error: "Email ya registrado" });
    }
  } catch (error) {
    return res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: error.message });
  }

  const claveHash = await encriptarContrasena(clave);

  console.log(claveHash);
  
  try {
    const newUsuario = await users.create({
        usuario,
        email,
        clave: claveHash
    });

    //rol 1 es usuario comun
    let rol = await Rol.findByPk(1);

    if (rol) {
      await newUsuario.addRol(rol);
    }
    
    return res.status(httpConst.HTTP_STATUS_OK).json({ message: "Usuario registrado" });
  } catch (error) {
    return res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { usuario, clave } = req.body;

  let usuarioExiste;
  if (usuario === "" || clave === "") {
    return res.status(httpConst.HTTP_STATUS_NOT_FOUND).json({ message: "Por favor rellenar campos" });
  }

  try {
    usuarioExiste = await users.findOne({ where: { usuario } });

    if (!usuarioExiste) {
      return res.status(httpConst.HTTP_STATUS_NOT_FOUND).json({ message: "Usuario no existe" });
    }
  } catch (error) {
    return res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: error.message });
  }

  const validPassword = await bcrypt.compare(clave, usuarioExiste.clave);
  if (!validPassword) {
    return res.status(httpConst.HTTP_STATUS_BAD_REQUEST).json({ error: 'Contraseña no válida' });
  }

  console.log(usuarioExiste.id);
  
  const roles = await rolesController.getRoles(usuarioExiste.id);

  const token = jwt.sign(
    {
      usuario: usuarioExiste.usuario,
      id: usuarioExiste.id,
      rol: roles,
      exp: Math.floor(Date.now() / 1000) + ((5 * 60) * 100)  // Expira en 5 minutos
    },
    process.env.TOKEN_SECRET
  );

  res.header("auth-token", token).json({
    error: null,
    data: { token },
  });
};

exports.verifyToken = async (req, res, next) => {
  const token = req.header("auth-token");

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    if (shouldRenewToken(decodedToken.exp)) {
      const renewedToken = await actualizarRolesYTiempoToken(decodedToken); // Actualizar roles del token
      req.user = jwt.verify(renewedToken, process.env.TOKEN_SECRET); // Verificar el token actualizado con los roles

      res.header('auth-token', renewedToken);

      console.log('Renewed Token:', renewedToken);
      const expirationDate = new Date(decodedToken.exp * 1000);
      const formattedExpiration = expirationDate.toLocaleString(); 
      console.log('Token expiration:', formattedExpiration);
      next();
    } else {
      console.log('El token todavía no expira');
      console.log('Token:', decodedToken);
      const expirationDate = new Date(decodedToken.exp * 1000);
      const formattedExpiration = expirationDate.toLocaleString(); 
      console.log('Token expiration:', formattedExpiration);
      next();
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(httpConst.HTTP_STATUS_UNAUTHORIZED).json({
        error: 'Token expired.',
        data: null,
      });
    }

    console.error(error);
    if (!res.headersSent) {
      return res.status(httpConst.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        error: 'Failed to verify or renew token.',
        data: null,
      });
    }
  }
};

function shouldRenewToken(exp) {
  const currentTime = Math.floor(Date.now() / 1000);
  const remainingTime = exp - currentTime;

  return remainingTime <= 300; // Renovar si quedan 5 minutos o menos para que expire
}

async function actualizarRolesYTiempoToken(decodedToken) {
  console.log('Entrando a actualizarRolesToken');
  console.log('Token decodificado:', decodedToken);

  try {
    const roles = await rolesController.getRoles(decodedToken.id);

    const expirationDate = Math.floor(Date.now() / 1000) + (5 * 60); // Agregar 300 segundos (5 minutos)

    const renewedToken = jwt.sign({ ...decodedToken, rol: roles, exp: expirationDate }, process.env.TOKEN_SECRET);
    console.log('Token renovado:', renewedToken);

    return renewedToken;
  } catch (error) {
    console.error('Error al actualizar los roles del token:', error);
    throw error;
  }
}

async function encriptarContrasena(contrasena) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contrasena, salt);
    return hash;
  } catch (error) {
    console.error('Error al encriptar la contraseña:', error);
    throw error;
  }
}

exports.esAdminRuta = (req, res, next) => {
  try {
    const token = req.header("auth-token");
    let tokenDecode = jwt_decode(token);
    console.log('jwt decodificado');
    console.log(tokenDecode);
    console.log(tokenDecode.rol.includes("admin"));

    if (tokenDecode.rol.includes("admin")) {
      next();
    } else {
      res.status(httpConst.HTTP_STATUS_BAD_REQUEST).json({ error: "Acceso denegado: se requiere rol de administrador." });
    }
  } catch (error) {
    res.status(httpConst.HTTP_STATUS_BAD_REQUEST).json({ error: "Acceso denegado" });
  }
};

exports.esUsuarioRuta = (req, res, next) => {
  try {
    const token = req.header("auth-token");
    let tokenDecode = jwt_decode(token);
    console.log('jwt decodificado');
    console.log(tokenDecode);
    console.log(tokenDecode.rol.includes("usuario"));

    if (tokenDecode.rol.includes("usuario")) {
      next();
    } else {
      res.status(httpConst.HTTP_STATUS_BAD_REQUEST).json({ error: "Acceso denegado: se requiere rol de usuario." });
    }
  } catch (error) {
    res.status(httpConst.HTTP_STATUS_BAD_REQUEST).json({ error: "Acceso denegado" });
  }
};

exports.esAdmin = (roles) => {
  return roles.includes("admin");
};

exports.esJefe = (roles) => {
  return roles.includes("jefe");
};
