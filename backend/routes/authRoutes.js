const express  = require('express');
const router   = express.Router();
const auth     = require('../controllers/authController');
const limiter  = require('../middleware/rateLimiter');

router.post('/register', limiter, auth.registerValidation, auth.register);
router.post('/login',    limiter, auth.login);
router.post('/logout',   (req, res) => res.json({ message: 'Logged out' }));
router.post('/forgot-password', limiter, auth.forgotPassword);
router.post('/reset-password',  limiter, auth.resetPassword);

module.exports = router;