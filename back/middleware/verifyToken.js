// back/middleware/verifyToken.js
const jwt = require('jsonwebtoken');

/**
 * Middleware que:
 *  1) Lee el header Authorization: Bearer <token>
 *  2) Verifica el JWT con JWT_SECRET
 *  3) Coloca { id, role, email } en req.user
 */
module.exports = function verifyToken(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = auth.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
