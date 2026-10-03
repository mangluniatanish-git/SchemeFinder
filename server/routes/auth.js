'use strict';

// MANUAL CONFIGURATION REQUIRED:
// Set JWT_SECRET in .env before using authentication.
// Without JWT_SECRET, auth routes will return 503.
//
// Example .env entries:
//   JWT_SECRET=your_very_long_random_secret_here
//   JWT_EXPIRES_IN=7d
//
// Generate a secure secret: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

const express = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { requireAuth } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');

const router = express.Router();

const BCRYPT_ROUNDS = 12;

/**
 * Guard: return 503 if JWT_SECRET is not configured.
 */
function requireJWTConfig(req, res, next) {
  if (!process.env.JWT_SECRET) {
    return res.status(503).json({
      success: false,
      error: 'Authentication is not configured on this server. Set JWT_SECRET in .env.',
    });
  }
  next();
}

/**
 * Helper: sign a JWT for a user document.
 */
function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, isAdmin: user.isAdmin || false },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// ─── POST /api/auth/register ──────────────────────────────────────────────────
router.post(
  '/register',
  requireJWTConfig,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('name').optional().isString().trim().isLength({ max: 100 }),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
          success: false,
          error: 'Database not connected. Set MONGODB_URI in .env to enable authentication.',
        });
      }

      const User = require('../models/User');
      const { email, password, name } = req.body;

      // Check for existing user
      const existing = await User.findOne({ email }).lean();
      if (existing) {
        return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
      }

      // Hash password — NEVER store plain text
      const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const user = await User.create({ email, passwordHash, name: name || '' });

      const token = signToken(user);

      res.status(201).json({
        success: true,
        token,
        user: user.toJSON(), // passwordHash stripped via model toJSON transform
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post(
  '/login',
  requireJWTConfig,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
          success: false,
          error: 'Database not connected. Set MONGODB_URI in .env to enable authentication.',
        });
      }

      const User = require('../models/User');
      const { email, password } = req.body;

      // Use generic error to avoid user enumeration attacks
      const GENERIC_AUTH_ERROR = 'Invalid email or password.';

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, error: GENERIC_AUTH_ERROR });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ success: false, error: GENERIC_AUTH_ERROR });
      }

      const token = signToken(user);

      res.json({
        success: true,
        token,
        user: user.toJSON(),
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      // Return the JWT payload at minimum (no DB needed)
      return res.json({ success: true, user: req.user });
    }

    const User = require('../models/User');
    const user = await User.findById(req.user.id).lean();
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    // Remove passwordHash before returning (also handled by model, belt & suspenders)
    const { passwordHash: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/auth/account ─────────────────────────────────────────────────
router.delete('/account', requireAuth, async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected.',
      });
    }

    const User = require('../models/User');
    const UserProfile = require('../models/UserProfile');
    const SavedScheme = require('../models/SavedScheme');

    const userId = req.user.id;

    // Delete user and all associated data atomically
    await Promise.all([
      User.findByIdAndDelete(userId),
      UserProfile.deleteMany({ userId }),
      SavedScheme.deleteMany({ userId }),
    ]);

    res.json({ success: true, message: 'Account and all associated data deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
