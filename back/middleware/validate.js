// back/middleware/validate.js
const { validationResult } = require('express-validator');

/**
 * Devuelve 422 si express-validator encontró errores.
 */
module.exports = function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};
