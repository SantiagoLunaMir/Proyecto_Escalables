// back/routes/doctors.js
const { Router } = require('express');
const Doctor     = require('../models/Doctor');
const { verifyToken, requireRole } = require('../middleware/auth');
const router     = Router();

// GET /api/doctors — público
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/doctors/:id — público
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ error: 'Doctor no encontrado' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/doctors — solo admin
router.post(
  '/', 
  verifyToken, 
  requireRole(['admin']), 
  async (req, res) => {
    const { name, specialty, contactInfo, address, notes } = req.body;
    try {
      const doctor = new Doctor({ name, specialty, contactInfo, address, notes });
      const saved = await doctor.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// PUT /api/doctors/:id — solo admin
router.put(
  '/:id', 
  verifyToken, 
  requireRole(['admin']), 
  async (req, res) => {
    const { name, specialty, contactInfo, address, notes } = req.body;
    try {
      const updated = await Doctor.findByIdAndUpdate(
        req.params.id,
        { name, specialty, contactInfo, address, notes },
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ error: 'Doctor no encontrado' });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// DELETE /api/doctors/:id — solo admin
router.delete(
  '/:id', 
  verifyToken, 
  requireRole(['admin']), 
  async (req, res) => {
    try {
      const deleted = await Doctor.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Doctor no encontrado' });
      res.json({ message: 'Doctor eliminado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
