// back/models/Delivery.js
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const DeliverySchema = new Schema({
  workId: {
    type: Schema.Types.ObjectId,
    ref: 'Work',
    required: true
  },
  driverId: {                            // ← nuevo
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pendiente', 'entregado'],
    default: 'pendiente'
  },
  amountCollected: {                     // ← nuevo
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Delivery', DeliverySchema);
