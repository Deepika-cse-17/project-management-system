const nodemailer = require('nodemailer');
const net = require('net');

// Strip any accidental surrounding quotes from env vars
const emailUser = (process.env.EMAIL_USER || '').replace(/^["']|["']$/g, '').trim();
const emailPass = (process.env.EMAIL_PASS || '').replace(/^["']|["']$/g, '').trim();

if (!emailUser || !emailPass) {
  console.error('[Email] WARNING: EMAIL_USER or EMAIL_PASS is not set!');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,          // STARTTLS on 587
  family: 4,              // Force IPv4 — Render free tier blocks IPv6
  auth: {
    user: emailUser,
    pass: emailPass,
  },
  tls: {
    rejectUnauthorized: true,
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000,
});

// Verify SMTP connection on startup
transporter.verify((err) => {
  if (err) {
    console.error('[Email] SMTP verify FAILED:', err.message);
    console.error('[Email] EMAIL_USER:', emailUser || '(empty)');
    console.error('[Email] EMAIL_PASS length:', emailPass.length, '(should be 16 for Gmail App Password)');
  } else {
    console.log('[Email] SMTP connection verified — ready to send as', emailUser);
  }
});

async function sendMail({ to, subject, text, html }) {
  console.log('[Email] Attempting to send to:', to);

  if (!emailUser || !emailPass) {
    throw new Error('Email credentials not configured. Set EMAIL_USER and EMAIL_PASS on Render.');
  }

  const mailOptions = {
    from: `ProjectHub <${emailUser}>`,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('[Email] Sent OK — MessageId:', info.messageId);
  return info;
}

module.exports = { sendMail, transporter };
