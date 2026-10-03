'use strict';

const rateLimit = require('express-rate-limit');

/**
 * General rate limiter — applied globally.
 * 100 requests per 15 minutes per IP.
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

/**
 * AI endpoint rate limiter — stricter because AI calls are expensive.
 * 10 requests per 15 minutes per IP.
 */
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'AI rate limit exceeded. Please wait 15 minutes before making more AI requests.',
  },
});

/**
 * Upload endpoint rate limiter — prevents abuse of file processing.
 * 5 requests per 15 minutes per IP.
 */
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Upload rate limit exceeded. Please wait 15 minutes before uploading again.',
  },
});

module.exports = { generalLimiter, aiLimiter, uploadLimiter };
