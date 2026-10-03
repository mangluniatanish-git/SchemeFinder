'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const { connectDB } = require('./config/db');
const { generalLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');

// ─── Route Imports ────────────────────────────────────────────────────────────
const schemesRouter = require('./routes/schemes');
const matchRouter   = require('./routes/match');
const profileRouter = require('./routes/profile');
const aiRouter      = require('./routes/ai');
const authRouter    = require('./routes/auth');
const alertsRouter  = require('./routes/alerts');
const adminRouter   = require('./routes/admin');

// ─── App Init ─────────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
// connectDB will log a clear warning and return without connecting if
// MONGODB_URI is not set, allowing the server to run in DEMO MODE.
connectDB();

// ─── CORS Configuration ───────────────────────────────────────────────────────
// MANUAL CONFIGURATION REQUIRED:
// Set VITE_API_BASE_URL in server .env if your frontend runs on a non-standard origin.
// Default: allows localhost:5173 and localhost:5174 (Vite dev servers).
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_ORIGIN,   // e.g. https://yourdomain.com in production
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin '${origin}' is not allowed.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet());

// ─── Logging ──────────────────────────────────────────────────────────────────
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── Global Rate Limiter ──────────────────────────────────────────────────────
app.use(generalLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    success: true,
    status: 'ok',
    env: NODE_ENV,
    demoMode: !process.env.MONGODB_URI,
    db: dbState[mongoose.connection.readyState] || 'unknown',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/schemes',  schemesRouter);
app.use('/api/match',    matchRouter);
app.use('/api/profile',  profileRouter);
app.use('/api/ai',       aiRouter);
app.use('/api/auth',     authRouter);
app.use('/api/alerts',   alertsRouter);
app.use('/api/admin',    adminRouter);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Must be LAST — after all routes.
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║         SchemeFinder API Server                   ║');
  console.log('╠═══════════════════════════════════════════════════╣');
  console.log(`║  Port     : ${PORT.toString().padEnd(37)}║`);
  console.log(`║  Env      : ${NODE_ENV.padEnd(37)}║`);
  console.log(`║  DB Mode  : ${(process.env.MONGODB_URI ? 'MongoDB' : 'DEMO (no DB)').padEnd(37)}║`);
  console.log(`║  Health   : http://localhost:${PORT}/api/health${' '.repeat(Math.max(0, 10 - PORT.toString().length))}║`);
  console.log('╚═══════════════════════════════════════════════════╝');

  if (!process.env.MONGODB_URI) {
    console.warn('\n⚠️  DEMO MODE: MONGODB_URI not set. Using in-memory seed data.');
    console.warn('   Set MONGODB_URI in server/.env to enable full database features.\n');
  }
  if (!process.env.JWT_SECRET) {
    console.warn('⚠️  AUTH DISABLED: JWT_SECRET not set. Auth routes will return 503.');
    console.warn('   Set JWT_SECRET in server/.env to enable authentication.\n');
  }
  if (!process.env.AI_API_KEY) {
    console.warn('⚠️  AI MOCK MODE: AI_API_KEY not set. Using rule-based profile extraction.');
    console.warn('   Set AI_API_KEY, AI_PROVIDER, AI_MODEL in server/.env for AI features.\n');
  }
});

module.exports = app; // For testing
