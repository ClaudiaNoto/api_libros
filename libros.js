const express = require ('express');
const router = express.Router();
const libros = require('../data');
const Joi = require ('joi');
const libroSchema = Joi.object({ //estructura de formato
    titulo: Joi.string().required().label('Título'),
    autor: Joi.string().required().label('Autor')
});
    // Obtener todos los libros
router.get('/', (req, res, next) => {
    try {
        res.json(libros);
    } 
    catch (err) {
        next(err);
    }
});
// Obtener un libro por ID
router.get('/:id', (req, res, next) => { // next es una función que se utiliza para pasar al siguiente middleware.
    try { //en el caso de q se encuentre la info 
        const id = req.params.id;
        const libro = libros.find((l) => l.id === id); //busca libro a traves de Id especifico(lo va comparando)
    
        if (!libro) {
            const error = new Error('Libro no encontrado');
            error.status = 404;
            throw error;
        }
        res.json(libro);
    } 
    catch (err) { //en el caso de que no se encuntre la info 
        next(err);
    }
});
// Crear un nuevo libro
router.post('/', (req, res, next) => {
    try {
        const { error, value } = libroSchema.validate(req.body);
        if (error) {
            const validationError = new Error('Error de validación');
            validationError.status = 400;
            validationError.details = error.details.map(detail =>
    detail.message);
            throw validationError;
        }
        const { titulo, autor } = value;
        const nuevoLibro = { //se crea nuevo libro con propiedades las siguientes propiedades extraidas del objeto value
            id: libros.length + 1, //ID en base a la longitud del nombre del libro (array) 
            titulo,
            autor
        };
        libros.push(nuevoLibro); //agrega a libros el nuevo libro 
        res.status(201).json(nuevoLibro); //codigo creado / .json envia el contenido de nuevo libro (forma json) al cliente 
    } 
    catch (err) {
        next(err);
    }
});
// Actualizar un libro existente
router.put('/:id', (req, res, next) => {
    try {
        const id = req.params.id; //extraer el id de los paramentros de la solicitud
        const { error, value } = libroSchema.validate(req.body); //Validar el objeto req.body utilizando el esquema de validación libroSchema
        if (error) {
            const validationError = new Error('Error de validación');
            validationError.status = 400;
            validationError.details = error.details.map(detail => //obtiene los detalles del error (usando joi), map itera sobre cada elemento obtenido del analisis del error 
            detail.message); //y extrae el valor de la propiedad de message del error
            throw validationError; //Se lanza el objeto de error, este interrumpe el flujo normal del programa y pasa el control al primer bloque catch
        }
        const { titulo, autor } = value;
        const libro = libros.find((l) => l.id === id);
        if (!libro) {
            const error = new Error('Libro no encontrado');
            error.status = 404;
            throw error;
        }
        libro.titulo = titulo || libro.titulo; //modifican propiedades del titulo y autor del libro 
        libro.autor = autor || libro.autor;
        res.json(libro);
    } 
    catch (err) {
        next(err);
    }
});
// Eliminar un libro
router.delete('/:id', (req, res, next) => {
    try {
        const id = req.params.id;
        const index = libros.findIndex((l) => l.id === id);
        if (index === -1) {
            const error = new Error('Libro no encontrado');
            error.status = 404;
            throw error;
        }
        const libroEliminado = libros.splice(index, 1); //eliminar un elemento del array segun su indice
        res.json(libroEliminado[0]);
    } 
    catch (err) {
        next(err);
    }
});
module.exports = router;
