const rateLimit = require('express-rate-limit');

// app.set('trust proxy', 1) is set in server.js — that's all express-rate-limit needs
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
