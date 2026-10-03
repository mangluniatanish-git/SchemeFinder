'use strict';

const express = require('express');
const { body, query, param } = require('express-validator');
const mongoose = require('mongoose');

const { handleValidationErrors } = require('../middleware/validate');
const { SEED_SCHEMES } = require('../services/seedData');

const router = express.Router();

/**
 * Helper: returns true when MongoDB is connected.
 */
function isDBConnected() {
  return mongoose.connection.readyState === 1;
}

/**
 * Apply query filters to the seed data array (for demo mode).
 */
function filterSeedSchemes(schemes, { category, type, state, status, search }) {
  let result = [...schemes];

  if (category) {
    result = result.filter((s) =>
      (s.categories || []).some((c) => c.toLowerCase() === category.toLowerCase())
    );
  }
  if (type) {
    result = result.filter((s) => s.type === type);
  }
  if (state) {
    result = result.filter(
      (s) => s.type === 'central' || (s.state || '').toLowerCase() === state.toLowerCase()
    );
  }
  if (status) {
    result = result.filter((s) => s.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        (s.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }

  return result;
}

// ─── GET /api/schemes ─────────────────────────────────────────────────────────
/**
 * List schemes with optional filters and pagination.
 * Query params: category, type, state, status, search, page (default 1), limit (default 20)
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be 1–100'),
    query('type').optional().isIn(['central', 'state']).withMessage('type must be central or state'),
    query('status')
      .optional()
      .isIn(['announced', 'open', 'closing_soon', 'closed', 'updated', 'unavailable'])
      .withMessage('Invalid status value'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const filters = {
        category: req.query.category,
        type: req.query.type,
        state: req.query.state,
        status: req.query.status,
        search: req.query.search,
      };

      if (!isDBConnected()) {
        // Demo mode — use seed data
        const filtered = filterSeedSchemes(SEED_SCHEMES, filters);
        const paginated = filtered.slice(skip, skip + limit);
        return res.json({
          success: true,
          demoMode: true,
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit),
          data: paginated,
        });
      }

      // Build Mongoose query
      const Scheme = require('../models/Scheme');
      const mongoQuery = {};

      if (filters.type) mongoQuery.type = filters.type;
      if (filters.status) mongoQuery.status = filters.status;
      if (filters.category) mongoQuery.categories = { $in: [filters.category] };
      if (filters.state) {
        mongoQuery.$or = [{ type: 'central' }, { state: new RegExp(filters.state, 'i') }];
      }
      if (filters.search) {
        mongoQuery.$text = { $search: filters.search };
      }

      const [schemes, total] = await Promise.all([
        Scheme.find(mongoQuery).skip(skip).limit(limit).lean(),
        Scheme.countDocuments(mongoQuery),
      ]);

      res.json({
        success: true,
        demoMode: false,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data: schemes,
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/schemes/:id ─────────────────────────────────────────────────────
/**
 * Get a single scheme by MongoDB ObjectId or slug.
 */
router.get(
  '/:id',
  [
    param('id').notEmpty().withMessage('id is required'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!isDBConnected()) {
        // Demo mode — search seed data by slug or _id
        const scheme = SEED_SCHEMES.find((s) => s.slug === id || s._id === id);
        if (!scheme) {
          return res.status(404).json({ success: false, error: 'Scheme not found' });
        }
        return res.json({ success: true, demoMode: true, data: scheme });
      }

      const Scheme = require('../models/Scheme');
      // Try ObjectId first, fallback to slug
      let scheme;
      if (mongoose.Types.ObjectId.isValid(id)) {
        scheme = await Scheme.findById(id).lean();
      }
      if (!scheme) {
        scheme = await Scheme.findOne({ slug: id }).lean();
      }
      if (!scheme) {
        return res.status(404).json({ success: false, error: 'Scheme not found' });
      }

      res.json({ success: true, data: scheme });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
