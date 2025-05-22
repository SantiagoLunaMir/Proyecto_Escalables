// back/models/Piece.js
const { Schema, model } = require('mongoose');

const PieceSchema = new Schema(
  {
    name:          { type: String, required: true, trim: true },
    description:   String,
    price:         { type: Number, min: 0 },
    estimatedTime: { type: Number, min: 1 },   // días
    technicianContact: String,
    images:        [{ type: String }],

    /* catálogo */
    isPublic: { type: Boolean, default: false }
  },
  { timestamps: true }
);

/* Índices */
PieceSchema.index({ isPublic: 1 });
PieceSchema.index({ name: 'text', description: 'text' });
PieceSchema.index({ price: 1 });
PieceSchema.index({ estimatedTime: 1 });

module.exports = model('Piece', PieceSchema);
