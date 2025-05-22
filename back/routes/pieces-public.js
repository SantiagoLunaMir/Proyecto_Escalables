// back/routes/pieces-public.js
const { Router } = require('express');
const Piece      = require('../models/Piece');

const router = Router();

router.get('/', async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip  = (page - 1) * limit;

  const filter = { isPublic: true };
  if (req.query.q)        filter.$text = { $search: req.query.q };
  if (req.query.priceMax) filter.price = { $lte: Number(req.query.priceMax) };
  if (req.query.timeMax)  filter.estimatedTime = { $lte: Number(req.query.timeMax) };

  const [total, pieces] = await Promise.all([
    Piece.countDocuments(filter),
    Piece.find(filter)
         .select('name price estimatedTime images')
         .skip(skip).limit(limit)
         .sort({ createdAt: -1 })
  ]);

  res.json({ page, pages: Math.max(1, Math.ceil(total / limit)), total, results: pieces });
});

module.exports = router;
