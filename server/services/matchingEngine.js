'use strict';

const mongoose = require('mongoose');
const { SEED_SCHEMES } = require('./seedData');

/**
 * DEMO_MODE is true when MongoDB is not configured.
 * In demo mode, matching runs against SEED_SCHEMES instead of the database.
 */
const DEMO_MODE = !process.env.MONGODB_URI;

// ─── Scoring Weights ──────────────────────────────────────────────────────────
// Adjust weights to tune relevance scoring.
const WEIGHTS = {
  occupation: 30,
  category: 20,
  income: 20,
  state: 10,
  age: 10,
  education: 10,
  disability: 15,
  gender: 10,
  interests: 15,
};

const MAX_SCORE = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);

// ─── Scoring Logic ────────────────────────────────────────────────────────────

/**
 * Scores a single scheme against a user profile.
 * Returns a score (0–100) and a list of match reasons.
 *
 * @param {Object} scheme - Scheme document (Mongoose doc or plain object)
 * @param {Object} profile - Normalised user profile
 * @returns {{ score: number, reasons: string[], disqualified: boolean }}
 */
function scoreScheme(scheme, profile) {
  const elig = scheme.eligibility || {};
  let score = 0;
  const reasons = [];

  // ── Occupation ──────────────────────────────────────────────────────────────
  if (elig.occupation && elig.occupation.length > 0) {
    if (profile.occupation && elig.occupation.includes(profile.occupation)) {
      score += WEIGHTS.occupation;
      reasons.push(`Matches your occupation (${profile.occupation})`);
    }
  } else {
    // Scheme open to all occupations
    score += WEIGHTS.occupation * 0.5;
  }

  // ── Category (SC/ST/OBC/General/EWS) ────────────────────────────────────────
  if (elig.category && elig.category.length > 0) {
    if (profile.category && elig.category.includes(profile.category)) {
      score += WEIGHTS.category;
      reasons.push(`Open to your category (${profile.category})`);
    } else if (profile.category) {
      // Hard disqualifier: scheme is category-specific and user doesn't match
      return { score: 0, reasons: [], disqualified: true };
    }
  } else {
    score += WEIGHTS.category * 0.5;
  }

  // ── Income ───────────────────────────────────────────────────────────────────
  if (elig.maxIncomeLakh != null) {
    if (profile.incomeValue != null) {
      if (profile.incomeValue <= elig.maxIncomeLakh) {
        score += WEIGHTS.income;
        reasons.push(`Income within limit (₹${elig.maxIncomeLakh}L)`);
      } else {
        // Over income limit — hard disqualifier
        return { score: 0, reasons: [], disqualified: true };
      }
    } else {
      // Income unknown — give partial score
      score += WEIGHTS.income * 0.3;
    }
  } else {
    score += WEIGHTS.income * 0.5;
  }

  // ── State ────────────────────────────────────────────────────────────────────
  if (elig.states && elig.states.length > 0) {
    if (profile.state && elig.states.some((s) => s.toLowerCase() === profile.state.toLowerCase())) {
      score += WEIGHTS.state;
      reasons.push(`Available in your state (${profile.state})`);
    } else if (profile.state) {
      // State-specific scheme — different state is a disqualifier
      return { score: 0, reasons: [], disqualified: true };
    }
  } else {
    // All-India scheme
    score += WEIGHTS.state;
    if (scheme.type === 'central') {
      reasons.push('Available across all states (Central scheme)');
    }
  }

  // ── Age ──────────────────────────────────────────────────────────────────────
  if (profile.age != null) {
    const minOk = elig.minAge == null || profile.age >= elig.minAge;
    const maxOk = elig.maxAge == null || profile.age <= elig.maxAge;
    if (minOk && maxOk) {
      score += WEIGHTS.age;
      if (elig.minAge != null || elig.maxAge != null) {
        reasons.push(`Age eligible (${elig.minAge || 0}–${elig.maxAge || '∞'} years)`);
      }
    } else {
      return { score: 0, reasons: [], disqualified: true };
    }
  } else {
    score += WEIGHTS.age * 0.3;
  }

  // ── Education ────────────────────────────────────────────────────────────────
  const EDU_RANK = {
    none: 0, primary: 1, secondary: 2, 'higher-secondary': 3, graduate: 4, postgraduate: 5,
  };
  if (elig.education && elig.education.length > 0) {
    if (profile.education && elig.education.includes(profile.education)) {
      score += WEIGHTS.education;
      reasons.push(`Education level matches (${profile.education})`);
    } else if (
      profile.education &&
      elig.education.some((e) => EDU_RANK[profile.education] >= EDU_RANK[e])
    ) {
      // Over-qualified but still eligible
      score += WEIGHTS.education * 0.7;
    }
  } else {
    score += WEIGHTS.education * 0.5;
  }

  // ── Disability ───────────────────────────────────────────────────────────────
  if (elig.disability === true) {
    if (profile.disability === 'yes') {
      score += WEIGHTS.disability;
      reasons.push('Specifically for persons with disability');
    } else {
      return { score: 0, reasons: [], disqualified: true };
    }
  } else if (profile.disability === 'yes') {
    // User has disability; scheme doesn't require/restrict it — slight bonus for relevance
    score += WEIGHTS.disability * 0.3;
  } else {
    score += WEIGHTS.disability * 0.5;
  }

  // ── Gender ───────────────────────────────────────────────────────────────────
  if (elig.gender && elig.gender !== 'any') {
    if (profile.gender && elig.gender === profile.gender) {
      score += WEIGHTS.gender;
      reasons.push(`Open to ${profile.gender}s`);
    } else if (profile.gender) {
      return { score: 0, reasons: [], disqualified: true };
    }
  } else {
    score += WEIGHTS.gender * 0.5;
  }

  // ── Interests / Category match ───────────────────────────────────────────────
  if (profile.interests && profile.interests.length > 0 && scheme.categories) {
    const matches = profile.interests.filter((i) =>
      scheme.categories.some((c) => c.toLowerCase().includes(i.toLowerCase()))
    );
    if (matches.length > 0) {
      score += WEIGHTS.interests;
      reasons.push(`Matches your interest in ${matches.join(', ')}`);
    }
  }

  // Normalise to 0–100
  const normalised = Math.min(100, Math.round((score / MAX_SCORE) * 100));
  return { score: normalised, reasons, disqualified: false };
}

// ─── Filter Helpers ───────────────────────────────────────────────────────────

function applyFilters(schemes, filters = {}) {
  let result = [...schemes];

  if (filters.category) {
    result = result.filter((s) =>
      (s.categories || []).some((c) => c.toLowerCase() === filters.category.toLowerCase())
    );
  }
  if (filters.type) {
    result = result.filter((s) => s.type === filters.type);
  }
  if (filters.status) {
    result = result.filter((s) => s.status === filters.status);
  }
  if (filters.state) {
    result = result.filter(
      (s) => s.type === 'central' || (s.state && s.state.toLowerCase() === filters.state.toLowerCase())
    );
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (s) =>
        (s.name || '').toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q) ||
        (s.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }

  return result;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * Matches schemes against a user profile and optional filters.
 * In DEMO_MODE, uses SEED_SCHEMES. Otherwise, loads from MongoDB.
 *
 * @param {Object} profile - User profile object
 * @param {Object} filters - Optional filters: { category, type, status, state, search }
 * @returns {Promise<Array>} Sorted array of { scheme, score, reasons }
 */
async function matchSchemes(profile, filters = {}) {
  let schemes;

  if (DEMO_MODE || mongoose.connection.readyState !== 1) {
    // Demo mode or DB not connected — use seed data
    schemes = SEED_SCHEMES;
  } else {
    // Load from MongoDB — only open/closing_soon schemes
    const Scheme = require('../models/Scheme');
    schemes = await Scheme.find({ status: { $in: ['open', 'closing_soon', 'announced'] } }).lean();
  }

  // Apply hard filters first
  const filtered = applyFilters(schemes, filters);

  // Score each scheme
  const scored = filtered
    .map((scheme) => {
      const { score, reasons, disqualified } = scoreScheme(scheme, profile);
      if (disqualified) return null;
      return { scheme, score, reasons };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  return scored;
}

module.exports = { matchSchemes, DEMO_MODE, scoreScheme };
