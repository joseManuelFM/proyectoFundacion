var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');

var indexRouter = require('./routes/index');
var personaRouter = require('./routes/api/persona');
var usuarioRouter = require('./routes/api/usuario');
var productoRouter = require('./routes/api/productos');
var mensajeRouter = require('./routes/api/mensajes');
var citasRouter = require('./routes/api/citas');
var favoritoRouter = require('./routes/api/favorito');
var seguidosRouter = require('./routes/api/seguidos');
var mensajeRouter = require('./routes/api/mensajes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/persona', personaRouter);
app.use('/usuario', usuarioRouter);
app.use('/producto', productoRouter);
app.use('/mensajes', mensajeRouter);
app.use('/citas', citasRouter);
app.use('/favorito', favoritoRouter);
app.use('/seguidos', seguidosRouter);
app.use('/mensaje',mensajeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var server = http.createServer(app);
var io = require('socket.io').listen(server);
var chatIoMethods = require('./routes/api/chat');

io.on('connection',chatIoMethods);


const port = 8000;
server.listen(port, () => {
    console.log("Server running in port: " + port);
});

module.exports = app;
