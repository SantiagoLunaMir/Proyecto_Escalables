// back/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Piece = require('./models/Piece');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    // 📌 Seed de piezas dentales
    await Piece.deleteMany({});
    await Piece.insertMany([
      {
        name: 'Corona provisional',
        description: 'Corona temporal de resina',
        estimatedTime: '2 días',
        technicianContact: 'técnico1@mail.com'
      },
      {
        name: 'Puente fijo',
        description: 'Puente cerámico de tres piezas',
        estimatedTime: '5 días',
        technicianContact: 'técnico2@mail.com'
      }
    ]);
    console.log('✅ Piezas creadas');

    // 📌 Seed de usuario admin
    const existingAdmin = await User.findOne({ email: 'admin@admin.com' });
    if (!existingAdmin) {
      const admin = new User({
        name: 'Admin Master',
        email: 'admin@admin.com',
        password: '123456',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Usuario admin creado: admin@admin.com / 123456');
    } else {
      console.log('ℹ️ El admin ya existe, no se creó uno nuevo.');
    }

    process.exit(0);
  })
  .catch(console.error);
