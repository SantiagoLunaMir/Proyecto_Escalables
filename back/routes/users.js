// back/routes/users.js
const { Router }  = require('express');
const { body, param }   = require('express-validator');
const User        = require('../models/User');
const validate    = require('../middleware/validate');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');

const router = Router();

/* ---------- Perfil propio ---------- */
router.get('/me', verifyToken, async (req, res) => {
  const me = await User.findById(req.user.id).select('-password');
  if (!me) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(me);
});

router.put('/me', verifyToken, async (req, res) => {
  try {
    // Construimos un objeto solo con los campos que llegaron
    const updates = {};
    ['name','phone','address','password'].forEach(f => {
      if (req.body[f] != null) updates[f] = req.body[f];
    });

    await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { runValidators: true, context: 'query' }
    );

    res.json({ message: 'Perfil actualizado' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});


/* ---------- Pendientes de aprobación ---------- */
router.get('/pending',
  verifyToken,
  requireRole(['admin']),
  async (_req, res) => {
    const pendings = await User.find({ approved: false, rejected: false })
                               .select('-password');
    res.json(pendings);
  }
);

/* ---------- Aprobar ---------- */
router.patch('/:id/approve',
  verifyToken,
  requireRole(['admin']),
  [param('id').isMongoId()],
  validate,
  async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'No encontrado' });

    user.role     = user.roleRequested;
    user.approved = true;
    await user.save();

    res.json({ message: 'Usuario aprobado' });
  }
);

/* ---------- Rechazar ---------- */
router.patch('/:id/reject',
  verifyToken,
  requireRole(['admin']),
  [param('id').isMongoId()],
  validate,
  async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'No encontrado' });

    user.rejected = true;
    await user.save();

    res.json({ message: 'Usuario rechazado' });
  }
);

/* ---------- Listado completo (admin) ---------- */
router.get('/',
  verifyToken,
  requireRole(['admin']),
  async (_req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
  }
);

/* ---------- EDITAR OTRO USUARIO (admin) ---------- */
router.put(
  '/:id',
  verifyToken,
  requireRole(['admin']),
  [ param('id').isMongoId() ],
  validate,
  async (req, res) => {
    const { name, email, role, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (name)     user.name     = name;
    if (email)    user.email    = email;
    if (role)     user.role     = role;
    if (password) user.password = password;  // se harcodea en pre-save
    await user.save();

    res.json({ message: 'Usuario actualizado' });
  }
);

/* ---------- ELIMINAR USUARIO (admin) ---------- */
router.delete(
  '/:id',
  verifyToken,
  requireRole(['admin']),
  [ param('id').isMongoId() ],
  validate,
  async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    await user.deleteOne();
    res.json({ message: 'Usuario eliminado' });
  }
);

// CREAR USUARIO (admin)
router.post(
  '/',
  verifyToken,
  requireRole(['admin']),
  [
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('role').isIn(['admin','technician','delivery'])
  ],
  validate,
  async (req, res) => {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email }))
      return res.status(409).json({ error: 'Email ya registrado' });
    // Asignamos roleRequested igual al rol deseado
    const u = await User.create({
      name,
      email,
      password,
      role,
      roleRequested: role,
      approved: true
    });
    // No es necesario setear 'rejected'
    res.status(201).json(u);
  }
);

module.exports = router;
