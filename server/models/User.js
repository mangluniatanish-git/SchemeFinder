'use strict';

const mongoose = require('mongoose');

/**
 * User — authentication and preference storage.
 *
 * SECURITY NOTES:
 * - NEVER store plain-text passwords. Only passwordHash (bcrypt).
 * - isAdmin defaults to false; only set manually in DB for trusted admins.
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    // NEVER store plain password here. Use bcryptjs to hash before saving.
  },
  name: {
    type: String,
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    // Set this manually in MongoDB for admin users.
    // Do NOT expose an API endpoint that allows setting isAdmin.
  },
  notificationPreferences: {
    email: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ─── Virtual: never serialize passwordHash to JSON ────────────────────────────
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
