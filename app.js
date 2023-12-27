const express = require('express');
const app = express();
app.use(express.json());

//importamos eñ rputer de libros
const librosRouter =require('./routers/libros');
//importamos el middleware error handler
const errorHandler = require('./middlewares/errorHandler');

app.use ('/libros', librosRouter);
app.use (errorHandler);

app.listen (3000, () =>{
    console.log ('servidor iniciado en el puerto 3000');
});