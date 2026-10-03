'use strict';

const mongoose = require('mongoose');

const eligibilitySchema = new mongoose.Schema(
  {
    minAge: Number,
    maxAge: Number,
    occupation: [String],
    maxIncomeLakh: Number,
    category: [String], // SC, ST, OBC, General, EWS, etc.
    gender: String,     // 'male', 'female', 'any'
    education: [String],
    states: [String],   // applicable states (empty = all India)
    disability: Boolean,
    notes: String,      // free-text eligibility notes
  },
  { _id: false }
);

const schemeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    nameHi: String,           // Hindi name
    ministry: { type: String, required: true },
    department: String,
    type: { type: String, enum: ['central', 'state'], required: true },
    state: String,            // For state schemes: which state

    categories: [String],     // e.g. ['agriculture', 'education', 'health']
    description: { type: String, required: true },
    descriptionHi: String,

    benefits: String,
    benefitsHi: String,

    eligibility: eligibilitySchema,

    documents: [String],      // list of required documents
    applicationProcess: String,

    tags: [String],
    keywords: [String],       // for full-text search boosts

    officialUrl: String,
    applyUrl: String,

    status: {
      type: String,
      enum: ['announced', 'open', 'closing_soon', 'closed', 'updated', 'unavailable'],
      default: 'open',
    },
    startDate: Date,
    endDate: Date,

    sourceVerified: { type: Boolean, default: false },
    lastVerified: Date,
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
schemeSchema.index({ slug: 1 });
schemeSchema.index({ categories: 1 });
schemeSchema.index({ type: 1 });
schemeSchema.index({ status: 1 });
schemeSchema.index({ tags: 1 });
// Text index for search
schemeSchema.index(
  { name: 'text', description: 'text', keywords: 'text', tags: 'text' },
  { name: 'scheme_text_search' }
);

const Scheme = mongoose.model('Scheme', schemeSchema);

module.exports = Scheme;
