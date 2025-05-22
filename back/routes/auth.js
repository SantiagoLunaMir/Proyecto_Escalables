// back/routes/auth.js
const { Router } = require('express');
const { body }  = require('express-validator');
const jwt       = require('jsonwebtoken');
const User      = require('../models/User');

const validate  = require('../middleware/validate');
const router    = Router();

/* ---------- Registro ---------- */
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Nombre requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('roleRequested')
      .isIn(['technician', 'delivery'])
      .withMessage('roleRequested debe ser technician o delivery')
  ],
  validate,
  async (req, res) => {
    try {
      const { name, email, password, phone, address, roleRequested } = req.body;

      if (await User.findOne({ email }))
        return res.status(409).json({ error: 'Email ya registrado' });

      await User.create({
        name,
        email,
        password,
        phone,
        address,
        roleRequested,
        role: 'pending',
        approved: false
      });

      res.status(201).json({ message: 'Solicitud enviada, espere aprobación' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ---------- Login ---------- */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Contraseña requerida')
  ],
  validate,
  async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    if (user.role !== 'admin' && !user.approved)
      return res.status(401).json({ error: 'Cuenta pendiente de aprobación' });

    const ok = await user.comparePassword(password);
    if (!ok)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  }
);

module.exports = router;
