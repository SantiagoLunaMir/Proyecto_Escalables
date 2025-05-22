// back/routes/pieces.js
const express    = require('express');
const router     = express.Router();
const path       = require('path');
const multer     = require('multer');
const Piece      = require('../models/Piece');
const { verifyToken, requireRole } = require('../middleware/auth');
const { param } = require('express-validator');
const validate    = require('../middleware/validate');

// 1) Configuración de almacenamiento con multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // opcional: timestamp + nombre original
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});
const upload = multer({
  storage,
  limits: { files: 8 },              // máximo 8 archivos
  fileFilter: (req, file, cb) => {
    // solo imágenes
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Sólo se permiten imágenes'));
    }
    cb(null, true);
  }
});

// Asegúrate en app.js de servir estáticos: 
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// GET todas las piezas (público)
router.get('/', async (req, res) => {
  try {
    const pieces = await Piece.find();
    res.json(pieces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET una pieza por ID (público)
router.get('/:id', async (req, res) => {
  try {
    const p = await Piece.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Pieza no encontrada' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST crear pieza (admin) — recibe multipart/form-data
router.post(
  '/',
  verifyToken,
  requireRole(['admin','technician']),
  upload.array('images', 8),
  async (req, res) => {
    try {
      const { name, description, estimatedTime, technicianContact } = req.body;
      // rutas relativas a /uploads
      const urls = (req.files || []).map(f => `/uploads/${f.filename}`);
      const piece = new Piece({ name, description, estimatedTime, technicianContact, images: urls });
      const saved = await piece.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// PUT actualizar pieza (admin) — multipart/form-data opcional
router.put(
  '/:id',
  verifyToken,
  requireRole(['admin']),
  upload.array('images', 8),
  async (req, res) => {
    try {
      const { name, description, estimatedTime, technicianContact } = req.body;
      const update = { name, description, estimatedTime, technicianContact };
      if (req.files && req.files.length) {
        const urls = req.files.map(f => `/uploads/${f.filename}`);
        update.images = urls;
      }
      const updated = await Piece.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ error: 'Pieza no encontrada' });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// DELETE pieza (admin)
router.delete(
  '/:id',
  verifyToken,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const deleted = await Piece.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Pieza no encontrada' });
      res.json({ message: 'Pieza eliminada' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.patch(
  '/:id/publish',
  verifyToken,
  requireRole(['admin']),
  [param('id').isMongoId()],
  validate,
  async (req, res) => {
    const piece = await Piece.findByIdAndUpdate(
      req.params.id,
      { isPublic: !!req.body.isPublic },
      { new: true }
    );
    if (!piece) return res.status(404).json({ error: 'Pieza no encontrada' });
    res.json({ message: 'Estado actualizado', isPublic: piece.isPublic });
  }
);

module.exports = router;
