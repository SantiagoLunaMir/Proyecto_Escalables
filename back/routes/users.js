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
  const { name, phone, address, password } = req.body;
  const me = await User.findById(req.user.id);
  if (!me) return res.status(404).json({ error: 'Usuario no encontrado' });

  if (name)  me.name  = name;
  if (phone) me.phone = phone;
  if (address) me.address = address;
  if (password) me.password = password; // hash en pre-save
  await me.save();

  res.json({ message: 'Perfil actualizado' });
});

/* ---------- Pendientes de aprobación ---------- */
router.get('/pending',
  verifyToken,
  requireRole(['admin']),
  async (_req, res) => {
    const pendings = await User.find({ approved: false, rejected: false })
                               .select('-password');
    res.json(pendings);
  });

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
  });

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
  });

/* ---------- Listado completo (admin) ---------- */
router.get('/',
  verifyToken,
  requireRole(['admin']),
  async (_req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
  });

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

    // Actualizo sólo los campos que vengan
    if (name)     user.name  = name;
    if (email)    user.email = email;
    if (role)     user.role  = role;
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
    const u = await User.create({ name, email, password, role, approved: true });
    res.status(201).json(u);
  }
);

module.exports = router;
