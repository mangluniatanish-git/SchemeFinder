'use strict';

const { validationResult } = require('express-validator');

/**
 * Middleware to handle express-validator validation errors.
 * Runs AFTER validator chains. If errors exist, returns 400 with field errors.
 * Otherwise, calls next() to continue to the route handler.
 *
 * Usage:
 *   router.post('/route', [body('field').notEmpty(), handleValidationErrors], handler)
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      fields: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
        value: e.value,
      })),
    });
  }
  next();
}

module.exports = { handleValidationErrors };
