const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { sendMail } = require('../utils/email');

// ----------------------
// REGISTER VALIDATION
// ----------------------
exports.registerValidation = [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>\[\]\\\/'`~;:_+=-]/)
    .withMessage('Password must contain at least one special character'),
];

// ----------------------
// REGISTER
// ----------------------
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { full_name, email, password } = req.body;

  try {
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name,
      email,
      password: hashed,
    });

    // Non-blocking welcome email
    sendMail({
      to: user.email,
      subject: 'Welcome to ProjectHub',
      text: `Welcome ${user.full_name}! Your account has been created successfully.`,
    }).catch((err) => {
      console.error('Welcome email failed:', err.message);
    });

    return res.status(201).json({
      message: 'User registered successfully',
      userId: user.id,
    });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ----------------------
// LOGIN
// ----------------------
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ----------------------
// FORGOT PASSWORD
// ----------------------
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    // Always return same response (security)
    if (!user) {
      return res.json({ message: 'If an account exists, an OTP was sent' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    user.password_reset_token = otp;
    user.password_reset_expires = expires;
    await user.save();

    // Send OTP email — if it fails, tell the user instead of silently hiding it
    try {
      await sendMail({
        to: user.email,
        subject: 'Your ProjectHub Password Reset OTP',
        text: `Your OTP is: ${otp}\n\nIt is valid for 10 minutes.\n\nIf you did not request this, please ignore this email.`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px">
            <h2 style="color:#1a1a1a">Password Reset OTP</h2>
            <p style="color:#666">Use the OTP below to reset your ProjectHub password. It expires in <strong>10 minutes</strong>.</p>
            <div style="background:#f4f4f4;border-radius:8px;padding:20px 24px;text-align:center;margin:24px 0">
              <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#1a1a1a">${otp}</span>
            </div>
            <p style="color:#999;font-size:13px">If you did not request a password reset, you can safely ignore this email.</p>
          </div>
        `,
      });
      console.log('OTP email sent successfully to:', user.email);
    } catch (emailErr) {
      console.error('OTP email send failed to', user.email, ':', emailErr.message);
      // Clear the token so the user can try again
      user.password_reset_token = null;
      user.password_reset_expires = null;
      await user.save();
      return res.status(500).json({
        message: 'Could not send OTP email. Please try again in a few minutes.',
      });
    }

    return res.json({ message: 'If an account exists, an OTP was sent' });

  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ----------------------
// RESET PASSWORD
// ----------------------
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    if (!user.password_reset_token || !user.password_reset_expires) {
      return res.status(400).json({ message: 'No reset request found' });
    }

    if (user.password_reset_token !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date(user.password_reset_expires) < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    user.password_reset_token = null;
    user.password_reset_expires = null;

    await user.save();

    return res.json({ message: 'Password reset successful' });

  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};