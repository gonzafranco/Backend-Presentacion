const Rol = require("../models/rol");
const Usuario= require("../models/usuario")

exports.cargarRoles = async  ()=> {
    try {
      // Cargar cuatro roles con el ID específico para el rol "Usuario"
      const roles = [
        { id: 2, nombre: 'admin' },
        { id: 1, nombre: 'usuario' },
        { id: 3, nombre: 'jefe' },
        // { id: 3, nombre: 'Invitado' }
      ];
  
      // Utilizar el método 'bulkCreate' de Sequelize para insertar múltiples registros de una vez
      await Rol.bulkCreate(roles, { validate: true, ignoreDuplicates: true });
  
      console.log('Roles cargados exitosamente.');
    } catch (error) {
      console.error('Error al cargar los roles:', error);
    }
  }
  


exports.cargarAdmin = async () => {
  try {
    const adminData = {
      usuario: 'admin',
      email: 'admin@admin',
      clave: '$2b$10$fHDI0JmztupXp/XST3wXAerzx/L1bHc62BhhezvMpL9t4ji6hsu36'
    };

    // Insertar el usuario en la base de datos
    const admin = await Usuario.create(adminData, { validate: true });

    // Buscar el rol con ID 2
    const rol = await Rol.findByPk(2);

    if (rol) {
      // Asignar el rol al usuario
      await admin.addRol(rol);
    }

    console.log('Admin cargado exitosamente.');
  } catch (error) {
    console.error('Error al cargar el admin:', error);
  }
};

