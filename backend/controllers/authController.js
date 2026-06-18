const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { sendMail } = require('../utils/email');
const crypto = require('crypto');

exports.registerValidation = [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?"":{}|<>\[\]\\/\\'`~;:_+=-]/).withMessage('Password must contain at least one special character'),
];

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { full_name, email, password } = req.body;
  try {
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ full_name, email, password: hashed });
    // send welcome email (best-effort, don't block on failure)
    try {
      await sendMail({
        to: user.email,
        subject: 'Welcome to ProjectHub',
        text: `Welcome to ProjectHub, ${user.full_name}! Your account has been created.`,
      });
    } catch (e) {
      console.error('Welcome email failed', e && e.message);
    }

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(200).json({ message: 'If an account exists, an OTP was sent' });

    // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.password_reset_token = otp;
    user.password_reset_expires = expires;
    await user.save();

    // send OTP email
    try {
      await sendMail({
        to: user.email,
        subject: 'Your ProjectHub Password Reset OTP',
        text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
      });
    } catch (e) {
      console.error('Error sending OTP email', e && e.message);
    }

    res.json({ message: 'If an account exists, an OTP was sent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/reset-password
// expects { email, otp, newPassword }
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) return res.status(400).json({ message: 'Missing required fields' });
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid token or email' });

    if (!user.password_reset_token || !user.password_reset_expires) return res.status(400).json({ message: 'No reset request found' });
    if (user.password_reset_token !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (new Date(user.password_reset_expires) < new Date()) return res.status(400).json({ message: 'OTP expired' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.password_reset_token = null;
    user.password_reset_expires = null;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, full_name: user.full_name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};