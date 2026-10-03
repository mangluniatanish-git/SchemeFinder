'use strict';

const mongoose = require('mongoose');

/**
 * SavedScheme — tracks which schemes a user has bookmarked.
 * Works for both authenticated users (userId) and session-based users (sessionId).
 */
const savedSchemeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  sessionId: String,

  schemeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scheme',
  },
  schemeSlug: String, // Denormalized for quick lookup without join

  savedAt: {
    type: Date,
    default: Date.now,
  },
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
savedSchemeSchema.index({ userId: 1, schemeId: 1 }, { unique: true, sparse: true });
savedSchemeSchema.index({ sessionId: 1 });
savedSchemeSchema.index({ schemeSlug: 1 });

const SavedScheme = mongoose.model('SavedScheme', savedSchemeSchema);

module.exports = SavedScheme;
