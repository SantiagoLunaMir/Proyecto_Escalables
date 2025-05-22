// back/middleware/security.js
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');

/**
 * Devuelve un array de middlewares de seguridad:
 *   – Helmet   : cabeceras HTTP seguras
 *   – RateLimit: 100 peticiones / 15 min por IP
 */
function securityMiddleware() {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1_000,   // 15 minutos
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
  });

  return [helmet(), limiter];
}

module.exports = securityMiddleware;   // ← exporta la FUNCIÓN
