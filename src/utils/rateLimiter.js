const rateLimit = require('express-rate-limit');
const requestIp = require('request-ip');

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
    },
    keyGenerator: (req, res) => {
        const forwardedHeader = req.get('Forwarded');
        if (forwardedHeader) {
            // The `Forwarded` header can contain multiple IPs; get the first one.
            const forwardedIp = forwardedHeader.split(';')[0].split('=')[1];
            if (forwardedIp) {
                return forwardedIp;
            }
        }
        // Fallback to the default IP if the 'Forwarded' header is not available or valid.
        return requestIp.getClientIp(req);
    },
});

module.exports = limiter;