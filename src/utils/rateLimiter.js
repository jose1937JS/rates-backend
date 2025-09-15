const rateLimit = require('express-rate-limit');

// Configuración del limitador de tasa
const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutos en milisegundos
    max: 5, // Limitar cada IP a 5 solicitudes por windowMs
    message: 'Has hecho demasiadas solicitudes, por favor intenta de nuevo en',
    // Manejo de la respuesta cuando se excede el límite
    handler: (req, res, next, options) => {
        res.status(429).json({
            error: `${options.message} ${Math.ceil(options.windowMs / 1000 / 60)} minutos.`
        });
    }
});

module.exports = limiter;