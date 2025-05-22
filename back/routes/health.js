// back/routes/health.js
const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.json({ status: 'OK', timestamp: Date.now() });
});

module.exports = router;
