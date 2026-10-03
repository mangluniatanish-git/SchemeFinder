'use strict';

// SCHEME RADAR: Full implementation requires:
// 1. A scheduled job (e.g. node-cron: npm install node-cron) to periodically
//    check official sources for new/updated schemes
// 2. MONGODB_URI configured so alerts can be persisted
// 3. Email credentials (e.g. nodemailer + SMTP) for email notifications
// 4. WhatsApp/SMS credentials (e.g. Twilio, MSG91) for push notifications
//
// See INTEGRATION_SETUP.md for full details.

const express = require('express');
const mongoose = require('mongoose');

const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// ─── GET /api/alerts ──────────────────────────────────────────────────────────
/**
 * Returns alerts/notifications for the current profile.
 *
 * Currently returns a stub with recently updated/announced schemes.
 * Full implementation: compare stored profile against newly crawled scheme data
 * and return personalised alerts.
 */
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        demoMode: true,
        alerts: [
          {
            id: 'demo_alert_1',
            type: 'new_scheme',
            title: 'PM-KISAN 16th instalment released',
            message:
              'The 16th instalment of PM-KISAN has been released. Check your bank account.',
            schemeSlug: 'pm-kisan',
            date: new Date().toISOString(),
          },
          {
            id: 'demo_alert_2',
            type: 'deadline',
            title: 'NSP Scholarship deadline approaching',
            message: 'The last date for NSP Post-Matric Scholarship applications is coming up.',
            schemeSlug: 'nsp-post-matric-sc',
            date: new Date().toISOString(),
          },
        ],
        message:
          'Demo alerts shown. Connect MongoDB and configure Scheme Radar for personalised alerts.',
      });
    }

    // TODO: Implement personalised alert retrieval from DB
    // 1. Get user's profile (by userId or sessionId)
    // 2. Query Scheme collection for recently updated schemes matching profile
    // 3. Return sorted alerts
    res.json({
      success: true,
      alerts: [],
      message: 'Scheme Radar is not yet fully implemented. See INTEGRATION_SETUP.md.',
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/alerts/preferences ─────────────────────────────────────────────
/**
 * Set notification preferences for the current user.
 * Body: { email: boolean, push: boolean }
 */
router.post('/preferences', optionalAuth, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required to save notification preferences.',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected. Set MONGODB_URI in .env.',
      });
    }

    const User = require('../models/User');
    const { email = false, push = false } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { notificationPreferences: { email, push } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    res.json({
      success: true,
      notificationPreferences: user.notificationPreferences,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
