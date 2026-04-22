const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin'], default: 'admin' },
    passwordResetTokenHash: { type: String, default: null, select: false },
    passwordResetExpires: { type: Date, default: null, select: false },
    failedLoginCount: { type: Number, default: 0, select: false },
    lockUntil: { type: Date, default: null, select: false },
    passwordChangedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

UserSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

module.exports = mongoose.model('User', UserSchema);
