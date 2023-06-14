var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const sequelize = require('./database/database');
const usuario = require('./models/usuario');
const tarea = require('./models/tarea');
const rol = require('./models/rol');
const creaTablas = require('./util/crea-tablas-predefinidas')
require('dotenv').config();



var usersRouter = require('./routes/users');

let authRouter= require('./routes/auth');
let adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


app.use('/users', usersRouter);

app.use('/auth',authRouter);
app.use('/admin',adminRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

async function arrancarBD() {
  try {
    await sequelize.sync({ force: true});
    creaTablas.cargarRoles();
    creaTablas.cargarAdmin();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

arrancarBD();


module.exports = app;
