'use strict';

// Placeholder AI routes — the main AI logic lives in aiService.js
// and is invoked via the profile/extract routes.
// This router exists for any future standalone AI endpoints.

const express = require('express');
const { body } = require('express-validator');

const { extractProfileFromText, isAIConfigured } = require('../services/aiService');
const { handleValidationErrors } = require('../middleware/validate');
const { aiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// ─── GET /api/ai/status ───────────────────────────────────────────────────────
/**
 * Returns the AI configuration status.
 * Useful for the frontend to show/hide AI-powered features.
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    configured: isAIConfigured(),
    provider: isAIConfigured() ? process.env.AI_PROVIDER : null,
    model: isAIConfigured() ? process.env.AI_MODEL : null,
    message: isAIConfigured()
      ? 'AI is configured and active.'
      : 'AI not configured. Set AI_API_KEY, AI_PROVIDER, AI_MODEL in .env. Running in mock mode.',
  });
});

// ─── POST /api/ai/extract ─────────────────────────────────────────────────────
/**
 * Direct AI text extraction endpoint.
 * Body: { text: string }
 */
router.post(
  '/extract',
  aiLimiter,
  [
    body('text')
      .isString()
      .trim()
      .isLength({ min: 5, max: 5000 })
      .withMessage('text must be 5–5000 characters'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const profile = await extractProfileFromText(req.body.text);
      res.json({ success: true, profile });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
