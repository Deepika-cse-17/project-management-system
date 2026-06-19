const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  standardHeaders: true,
  legacyHeaders: false,

  // 🔥 IMPORTANT FIX FOR RENDER
  trustProxy: true,
});

module.exports = limiter;