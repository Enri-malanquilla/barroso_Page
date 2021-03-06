//llamadas a librerías
require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const expressFileUpload = require('express-fileupload');
const morgan = require('morgan');
//variables librerias
const app = express();
const { PORT, HOST } = process.env;

//endpoints
app.use(express.json());
app.use(fileUpload());
app.use(morgan('dev'));
/*
#######################
//MIDDLEWARES
#######################
*/

const { authUser } = require('./middleware');
/*
####################
######USUARIOS######
###################
*/
//llamada endpoint usuarios

const {
  loginUser,
  createUserAdmin,
  deleteUserAdmin,
} = require('./controllers/user/index');

//endpoint usuarios
//login usuarios*
app.post('/login', loginUser);
//crear usuario por admin
app.post('/create_u_admin', authUser, createUserAdmin);
//eliminar usuario por admin
app.post('/deleteduseradmin/:idUser', authUser, deleteUserAdmin);
//errores
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  });
});

//not found
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not Found',
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at ${HOST}${PORT}`);
});
