// back/middleware/requireRole.js
/**
 * Middleware de autorización por rol.
 *  Uso: requireRole(['admin','technician'])
 */
module.exports = allowedRoles => (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    next();
  };
  