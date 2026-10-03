'use strict';

const express = require('express');
const { body } = require('express-validator');

const { matchSchemes } = require('../services/matchingEngine');
const { handleValidationErrors } = require('../middleware/validate');
const { aiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// ─── POST /api/match ──────────────────────────────────────────────────────────
/**
 * Match schemes against a user profile + optional filters.
 *
 * Request body:
 *   {
 *     profile: { age, gender, state, income, incomeValue, occupation, education, category, disability, interests },
 *     filters: { category, type, state, status, search }  // optional
 *   }
 *
 * Response:
 *   {
 *     success: true,
 *     total: number,
 *     matches: [{ scheme, score, reasons }]
 *   }
 */
router.post(
  '/',
  aiLimiter, // Shared rate limiter — matching is computationally similar to AI calls
  [
    body('profile')
      .isObject()
      .withMessage('profile must be an object'),
    body('filters')
      .optional()
      .isObject()
      .withMessage('filters must be an object if provided'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const { profile, filters = {} } = req.body;

      // Sanity check — profile must have at least one meaningful field
      const profileFields = ['age', 'gender', 'state', 'occupation', 'category', 'income', 'incomeValue', 'education'];
      const hasMeaningfulData = profileFields.some(
        (f) => profile[f] !== undefined && profile[f] !== null && profile[f] !== ''
      );

      if (!hasMeaningfulData) {
        return res.status(400).json({
          success: false,
          error: 'Profile must contain at least one field (age, gender, state, occupation, etc.)',
        });
      }

      const matches = await matchSchemes(profile, filters);

      res.json({
        success: true,
        total: matches.length,
        matches,
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
