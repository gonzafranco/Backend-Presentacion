const { Sequelize } = require("sequelize");

// //config tra
// const sequelize = new Sequelize("presentacionDB", "plataforma", "plataforma", {
//   host: "localhost",
//   // host: 'postgres', //utilizar cuando se compila el codigo nodejs como container y se utiliza de manera colectiva en docker-compose
//   dialect: "postgres",
//   port: 5432,
//   define: {
//     // timestamps: true,
//     // freezeTableName: true,
//     paranoid: true,
//   },
// });

//config casa

const sequelize = new Sequelize('presentacionDB', 'root', 'root', {
  host: 'localhost',
  // host: 'postgres', //utilizar cuando se compila el codigo nodejs como container y se utiliza de manera colectiva en docker-compose
  dialect: 'postgres',
  port: 5432,
  define: {
    // timestamps: true,
    // freezeTableName: true,
    paranoid: true
  }
});

module.exports = sequelize;
