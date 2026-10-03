'use strict';

const mongoose = require('mongoose');

/**
 * UserProfile — stores a user's demographic profile for scheme matching.
 *
 * Two modes:
 *   - 'one-time': identified by sessionId; auto-expires after 7 days (TTL index)
 *   - 'saved': linked to an authenticated User document via userId
 */
const userProfileSchema = new mongoose.Schema({
  sessionId: String,  // For one-time (non-authenticated) mode
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },                  // For saved (authenticated) mode

  mode: {
    type: String,
    enum: ['one-time', 'saved'],
    default: 'one-time',
  },

  // ─── Demographic Fields ───────────────────────────────────────────────────
  age: Number,
  gender: String,       // 'male' | 'female' | 'other'
  state: String,
  city: String,
  income: String,       // human-readable range, e.g. "1-2.5 lakh"
  incomeValue: Number,  // numeric value in lakhs for comparison
  occupation: String,   // 'farmer' | 'student' | 'business' | 'salaried' | etc.
  education: String,    // 'none' | 'primary' | 'secondary' | 'graduate' | 'postgraduate'
  category: String,     // 'SC' | 'ST' | 'OBC' | 'General' | 'EWS'
  disability: String,   // 'yes' | 'no' | undefined

  interests: [String],  // categories of interest

  rawText: String,      // original text input (from manual entry or CV)

  createdAt: {
    type: Date,
    default: Date.now,
    // TTL index: Mongoose/MongoDB will auto-delete one-time profiles after 7 days
    expires: '7d',
  },
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
userProfileSchema.index({ sessionId: 1 });
userProfileSchema.index({ userId: 1 });

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
