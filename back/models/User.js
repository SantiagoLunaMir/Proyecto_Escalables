// back/models/User.js
const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8 },

    phone:    String,
    address:  String,

    /* --- Flujo de aprobación --- */
    roleRequested: { type: String, enum: ['technician', 'delivery'], required: true },
    role:          { type: String, enum: ['admin', 'technician', 'delivery', 'pending'], default: 'pending' },
    approved:      { type: Boolean, default: false },
    rejected:      { type: Boolean, default: false }
  },
  { timestamps: true }
);

/* ---------- Hooks ---------- */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* ---------- Métodos ---------- */
UserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

/* ---------- Índices ---------- */
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ approved: 1 });

module.exports = model('User', UserSchema);
