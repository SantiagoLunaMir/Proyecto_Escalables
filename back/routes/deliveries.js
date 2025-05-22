// back/routes/deliveries.js
const { Router }    = require('express');
const Delivery      = require('../models/Delivery');
const Work          = require('../models/Work');
const verifyToken   = require('../middleware/verifyToken');
const requireRole   = require('../middleware/requireRole');

const router = Router();

/* ---------- ASIGNAR trabajos al repartidor ---------- */
router.post(
  '/assign',
  verifyToken,
  requireRole(['delivery','admin']),
  async (req, res) => {
    const { workIds } = req.body;
    if (!Array.isArray(workIds) || !workIds.length)
      return res.status(400).json({ error: 'workIds requerido' });

    const ya = await Delivery.find({
      workId: { $in: workIds },
      status: 'pendiente'
    }).distinct('workId');

    const libres = workIds.filter(id => !ya.includes(id));
    if (!libres.length) return res.status(400).json({ error: 'Ya asignados' });

    const deliveries = await Promise.all(
      libres.map(id => Delivery.create({ workId: id, driverId: req.user.id }))
    );

    await Work.updateMany(
      { _id: { $in: libres } },
      { status: 'En entrega' }
    );

    res.status(201).json(deliveries);
  }
);

/* ---------- ENTREGAS PENDIENTES DEL CONDUCTOR ---------- */
router.get(
  '/today',
  verifyToken,
  requireRole(['delivery','admin']),
  async (req, res) => {
    const list = await Delivery.find({
      driverId: req.user.id,
      status: 'pendiente'
    }).populate({
      path: 'workId',
      populate: [
        { path: 'pieceId', select: 'name' },
        { path: 'doctorId', select: 'name address' }
      ]
    });
    res.json(list);
  }
);

/* ---------- MARCAR ENTREGADO ---------- */
router.put(
  '/:id/delivered',
  verifyToken,
  requireRole(['delivery','admin']),
  async (req, res) => {
    const d = await Delivery.findById(req.params.id).populate('workId');
    // --- aquí el optional-chaining para evitar que d.driverId sea undefined:
    if (
      !d ||
      ((d.driverId?.toString() ?? '') !== req.user.id && req.user.role !== 'admin')
    ) {
      return res.status(404).json({ error: 'No encontrado' });
    }

    if (req.body.amountCollected != null) {
      d.amountCollected = req.body.amountCollected;
    }
    d.status = 'entregado';
    await d.save();

    // Actualizo el Work asociado
    d.workId.status = 'completado';
    await d.workId.save();

    res.json({ message: 'Entregado', amountCollected: d.amountCollected });
  }
);

/* ---------- CANCELAR ENTREGA ---------- */
router.delete(
  '/:id',
  verifyToken,
  requireRole(['delivery','admin']),
  async (req, res) => {
    const d = await Delivery.findById(req.params.id);
    if (!d) {
      return res.status(404).json({ error: 'No encontrado' });
    }
    if (
      d.driverId &&
      d.driverId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Revertir estado del Work a "pendiente"
    const work = await Work.findById(d.workId);
    if (work) {
      work.status = 'pendiente';
      await work.save();
    }

    await d.deleteOne();
    res.json({ message: 'Entrega cancelada' });
  }
);

module.exports = router;
