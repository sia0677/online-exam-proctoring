const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const securityMiddleware = require('./middlewares/securityMiddleware');
const v1Routes = require('./routes/v1');

const app = express();

// Security Middlewares
app.use(helmet());

// CORS — allow Vite dev server and same-origin in production
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());

// Custom Security Middleware
app.use(securityMiddleware);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'ARVO API is running', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1', v1Routes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ success: false, error: `An account with that ${field} already exists.` });
  }
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, error: messages.join('. ') });
  }
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

module.exports = app;
