const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { message: 'Too many attempts, please try again in a minute' },
});