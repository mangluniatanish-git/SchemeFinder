'use strict';

const express = require('express');
const { body, param } = require('express-validator');
const mongoose = require('mongoose');

const { requireAuth } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');

const router = express.Router();

// ─── Admin guard middleware ───────────────────────────────────────────────────
/**
 * Requires the user to be authenticated AND have isAdmin === true.
 * isAdmin is set directly in MongoDB — there is NO API endpoint to grant admin.
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      error: 'Admin access required. Contact your system administrator.',
    });
  }
  next();
}

// Apply auth + admin check to ALL admin routes
router.use(requireAuth, requireAdmin);

// ─── GET /api/admin/schemes ───────────────────────────────────────────────────
/**
 * List ALL schemes (including closed/unavailable) for admin review.
 */
router.get('/schemes', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, error: 'Database not connected.' });
    }

    const Scheme = require('../models/Scheme');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [schemes, total] = await Promise.all([
      Scheme.find({}).skip(skip).limit(limit).sort({ lastUpdated: -1 }).lean(),
      Scheme.countDocuments(),
    ]);

    res.json({ success: true, total, page, limit, data: schemes });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/admin/schemes ──────────────────────────────────────────────────
/**
 * Add a new scheme.
 */
router.post(
  '/schemes',
  [
    body('name').notEmpty().withMessage('name is required'),
    body('slug').notEmpty().withMessage('slug is required'),
    body('ministry').notEmpty().withMessage('ministry is required'),
    body('type').isIn(['central', 'state']).withMessage('type must be central or state'),
    body('description').notEmpty().withMessage('description is required'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ success: false, error: 'Database not connected.' });
      }

      const Scheme = require('../models/Scheme');
      const scheme = await Scheme.create({ ...req.body, lastUpdated: new Date() });
      res.status(201).json({ success: true, data: scheme });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ success: false, error: 'A scheme with this slug already exists.' });
      }
      next(err);
    }
  }
);

// ─── PUT /api/admin/schemes/:id ───────────────────────────────────────────────
/**
 * Update a scheme's full data.
 */
router.put(
  '/schemes/:id',
  [
    param('id').notEmpty().withMessage('id is required'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ success: false, error: 'Database not connected.' });
      }

      const Scheme = require('../models/Scheme');
      const scheme = await Scheme.findByIdAndUpdate(
        req.params.id,
        { ...req.body, lastUpdated: new Date() },
        { new: true, runValidators: true }
      );

      if (!scheme) {
        return res.status(404).json({ success: false, error: 'Scheme not found.' });
      }

      res.json({ success: true, data: scheme });
    } catch (err) {
      next(err);
    }
  }
);

// ─── DELETE /api/admin/schemes/:id ────────────────────────────────────────────
/**
 * Archive (soft-delete) a scheme by setting status to 'unavailable'.
 * We don't hard-delete to preserve audit trail.
 */
router.delete(
  '/schemes/:id',
  [
    param('id').notEmpty().withMessage('id is required'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ success: false, error: 'Database not connected.' });
      }

      const Scheme = require('../models/Scheme');
      const scheme = await Scheme.findByIdAndUpdate(
        req.params.id,
        { status: 'unavailable', lastUpdated: new Date() },
        { new: true }
      );

      if (!scheme) {
        return res.status(404).json({ success: false, error: 'Scheme not found.' });
      }

      res.json({ success: true, message: 'Scheme archived (status set to unavailable).', data: scheme });
    } catch (err) {
      next(err);
    }
  }
);

// ─── PUT /api/admin/schemes/:id/status ────────────────────────────────────────
/**
 * Update just the status and lastVerified timestamp of a scheme.
 * Body: { status: string }
 */
router.put(
  '/schemes/:id/status',
  [
    param('id').notEmpty(),
    body('status')
      .isIn(['announced', 'open', 'closing_soon', 'closed', 'updated', 'unavailable'])
      .withMessage('Invalid status value'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ success: false, error: 'Database not connected.' });
      }

      const Scheme = require('../models/Scheme');
      const now = new Date();
      const scheme = await Scheme.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status, lastVerified: now, lastUpdated: now },
        { new: true, runValidators: true }
      );

      if (!scheme) {
        return res.status(404).json({ success: false, error: 'Scheme not found.' });
      }

      res.json({ success: true, data: scheme });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
