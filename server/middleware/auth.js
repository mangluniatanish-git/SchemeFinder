'use strict';

const jwt = require('jsonwebtoken');

// MANUAL CONFIGURATION REQUIRED:
// Set JWT_SECRET in your .env file before using authentication.
// Example: JWT_SECRET=your_very_long_random_secret_here
// Generate one with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
if (!process.env.JWT_SECRET) {
  console.warn('[AUTH] MANUAL CONFIGURATION REQUIRED: Set JWT_SECRET in .env');
}

/**
 * Reads the JWT from the Authorization header (Bearer token).
 * Returns the decoded payload or null.
 */
function decodeToken(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7); // Remove "Bearer " prefix
  try {
    return jwt.verify(token, process.env.JWT_SECRET || '__DEMO_SECRET__');
  } catch {
    return null;
  }
}

/**
 * requireAuth — rejects the request with 401 if the token is missing/invalid.
 * Attaches req.user = decoded JWT payload if valid.
 */
function requireAuth(req, res, next) {
  if (!process.env.JWT_SECRET) {
    return res.status(503).json({
      success: false,
      error: 'Authentication is not configured on this server. Set JWT_SECRET in .env.',
    });
  }

  const user = decodeToken(req);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized. Please provide a valid Bearer token.',
    });
  }

  req.user = user;
  next();
}

/**
 * optionalAuth — attaches req.user if a valid token is present.
 * If no token or invalid token, req.user is null (does NOT reject the request).
 */
function optionalAuth(req, res, next) {
  req.user = decodeToken(req) || null;
  next();
}

module.exports = { requireAuth, optionalAuth };
