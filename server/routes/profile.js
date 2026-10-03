'use strict';

const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const mongoose = require('mongoose');

const { extractProfileFromText, extractProfileFromCVText } = require('../services/aiService');
const { handleValidationErrors } = require('../middleware/validate');
const { optionalAuth } = require('../middleware/auth');
const { aiLimiter, uploadLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// ─── Multer: memory storage (no temp files left on disk) ─────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter(req, file, cb) {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are accepted.'));
    }
  },
});

// ─── Helper: is DB connected ──────────────────────────────────────────────────
function isDBConnected() {
  return mongoose.connection.readyState === 1;
}

// ─── POST /api/profile/extract/text ──────────────────────────────────────────
/**
 * Extract a profile from free-form text input.
 * Body: { text: string }
 */
router.post(
  '/extract/text',
  aiLimiter,
  [
    body('text')
      .isString()
      .trim()
      .isLength({ min: 10, max: 5000 })
      .withMessage('text must be between 10 and 5000 characters'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const { text } = req.body;
      const profile = await extractProfileFromText(text);
      res.json({ success: true, profile });
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/profile/extract/cv ─────────────────────────────────────────────
/**
 * Extract a profile from an uploaded CV (PDF or DOCX).
 * Multipart form: file field = 'cv'
 *
 * INTEGRATION NOTE:
 * For PDF text extraction, install: npm install pdf-parse
 * For DOCX text extraction, install: npm install mammoth
 * See inline comments below for integration points.
 */
router.post(
  '/extract/cv',
  uploadLimiter,
  upload.single('cv'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded. Send a PDF or DOCX as multipart field "cv".' });
      }

      const { mimetype, buffer, originalname } = req.file;
      let extractedText = '';

      if (mimetype === 'application/pdf') {
        // INTEGRATION: Uncomment below after running: npm install pdf-parse
        // const pdfParse = require('pdf-parse');
        // const pdfData = await pdfParse(buffer);
        // extractedText = pdfData.text;

        // Placeholder until pdf-parse is installed:
        extractedText = `[PDF text extraction not yet enabled. Install pdf-parse: npm install pdf-parse and uncomment the integration code in routes/profile.js] Original file: ${originalname}`;
      } else if (
        mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        // INTEGRATION: Uncomment below after running: npm install mammoth
        // const mammoth = require('mammoth');
        // const result = await mammoth.extractRawText({ buffer });
        // extractedText = result.value;

        // Placeholder until mammoth is installed:
        extractedText = `[DOCX text extraction not yet enabled. Install mammoth: npm install mammoth and uncomment the integration code in routes/profile.js] Original file: ${originalname}`;
      }

      // Buffer is in memory — no disk cleanup needed (memoryStorage)
      const profile = await extractProfileFromCVText(extractedText);

      res.json({
        success: true,
        profile,
        note: profile.mock
          ? 'AI not configured — returned rule-based extraction. Set AI_API_KEY in .env for better results.'
          : undefined,
      });
    } catch (err) {
      // Handle multer errors (file type, size)
      if (err.message && (err.message.includes('PDF') || err.message.includes('DOCX'))) {
        return res.status(400).json({ success: false, error: err.message });
      }
      next(err);
    }
  }
);

// ─── POST /api/profile ────────────────────────────────────────────────────────
/**
 * Save a user profile.
 * - Authenticated users: saved to DB linked to userId
 * - Anonymous users: saved to DB linked to sessionId (7-day TTL)
 * Body: profile object + optional sessionId
 */
router.post(
  '/',
  optionalAuth,
  [
    body('profile').isObject().withMessage('profile must be an object'),
    body('sessionId').optional().isString(),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const { profile, sessionId } = req.body;

      if (!isDBConnected()) {
        // Demo mode — return the profile as-is with a note
        return res.json({
          success: true,
          demoMode: true,
          message: 'Profile received (not persisted — DB not configured)',
          profile,
        });
      }

      const UserProfile = require('../models/UserProfile');

      const doc = {
        ...profile,
        mode: req.user ? 'saved' : 'one-time',
      };
      if (req.user) {
        doc.userId = req.user.id;
      } else {
        doc.sessionId = sessionId || null;
      }

      // Upsert: replace existing profile for same user/session
      const filter = req.user
        ? { userId: req.user.id }
        : { sessionId: doc.sessionId };

      const saved = await UserProfile.findOneAndUpdate(filter, doc, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });

      res.json({ success: true, profile: saved });
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/profile ─────────────────────────────────────────────────────────
/**
 * Retrieve a saved profile.
 * - Authenticated: by userId
 * - Anonymous: by sessionId query param
 */
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      return res.json({ success: true, demoMode: true, profile: null });
    }

    const UserProfile = require('../models/UserProfile');
    const filter = req.user
      ? { userId: req.user.id }
      : { sessionId: req.query.sessionId };

    if (!filter.userId && !filter.sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Provide a sessionId query param or a valid auth token.',
      });
    }

    const profile = await UserProfile.findOne(filter).lean();
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    res.json({ success: true, profile });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/profile ──────────────────────────────────────────────────────
/**
 * Delete a saved profile.
 */
router.delete('/', optionalAuth, async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      return res.json({ success: true, demoMode: true, message: 'Nothing to delete (demo mode)' });
    }

    const UserProfile = require('../models/UserProfile');
    const filter = req.user
      ? { userId: req.user.id }
      : { sessionId: req.query.sessionId };

    if (!filter.userId && !filter.sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Provide a sessionId query param or a valid auth token.',
      });
    }

    await UserProfile.deleteOne(filter);
    res.json({ success: true, message: 'Profile deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
