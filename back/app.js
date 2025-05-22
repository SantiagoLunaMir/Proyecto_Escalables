// back/app.js
require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const path      = require('path');

const security  = require('./middleware/security');   //  ← nuevo

// Rutas
const healthRouter         = require('./routes/health');
const authRouter           = require('./routes/auth');
const usersRouter          = require('./routes/users');
const doctorsRouter        = require('./routes/doctors');
const piecesRouter         = require('./routes/pieces');
const worksRouter          = require('./routes/works');
const deliveriesRouter     = require('./routes/deliveries');
const piecesPublicRouter   = require('./routes/pieces-public');

const app = express();

/* ------------  Middlewares globales  ------------ */
app.use(cors());
app.use(express.json());
app.use(...security());                  // Helmet + rate-limit

/* ------------  Archivos estáticos  ------------- */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ------------  Rutas API  ---------------------- */
app.use('/health',             healthRouter);     
app.use('/api/auth',           authRouter);
app.use('/api/users',          usersRouter);
app.use('/api/doctors',        doctorsRouter);
app.use('/api/works',          worksRouter);
app.use('/api/pieces',         piecesRouter);
app.use('/api/deliveries',     deliveriesRouter);
app.use('/api/public/pieces',  piecesPublicRouter);

/* ------------  Conexión MongoDB y arranque  ---- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error MongoDB:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend escuchando en http://localhost:${PORT}`);
});
