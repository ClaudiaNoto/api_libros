const errorHandler = (err, req, res, next) => {
    console.error (err);
    res.status(err.status || 500).json({error: err.message ||'Error en el servidor'}); // Manejar el error y acceder a su propiedad de estado http,
    // la cual se utiliza para indicar el resultado de una solicitud realizada por un cliente a un servidor web
};

module.exports = errorHandler;