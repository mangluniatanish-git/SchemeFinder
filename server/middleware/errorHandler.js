'use strict';

/**
 * Global Express error handler.
 * - Logs full error details server-side (always).
 * - NEVER exposes stack traces to the client in production.
 * - Returns structured { success: false, error: message } JSON.
 *
 * Must be registered LAST (after all routes) in index.js:
 *   app.use(errorHandler);
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const isProd = process.env.NODE_ENV === 'production';

  // Always log the full error server-side
  console.error('[ERROR]', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  // Determine HTTP status
  const status = err.status || err.statusCode || 500;

  // Build client-facing error payload
  const payload = {
    success: false,
    error: isProd && status === 500
      ? 'An internal server error occurred. Please try again later.'
      : err.message || 'Something went wrong',
  };

  // In development, attach stack trace for easier debugging
  if (!isProd && err.stack) {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
}

module.exports = { errorHandler };
