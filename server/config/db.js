'use strict';

const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the MONGODB_URI environment variable.
 * If MONGODB_URI is not set, logs a clear warning and returns without connecting
 * so the server can still run in DEMO MODE with seed data.
 */
async function connectDB() {
  if (!process.env.MONGODB_URI) {
    console.warn(
      '[DB] MANUAL CONFIGURATION REQUIRED: Set MONGODB_URI in .env to enable database features. Running in demo mode.'
    );
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 8 has these as defaults, but be explicit for clarity
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('[DB] MongoDB connection error:', err.message);
    console.warn('[DB] Falling back to DEMO MODE — database features will be unavailable.');
    // Do NOT crash the process; let the app run in demo mode
  }
}

module.exports = { connectDB };
