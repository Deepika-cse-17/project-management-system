const nodemailer = require('nodemailer');

// Strip any accidental surrounding quotes from env vars
// (common issue when copy-pasting into Render dashboard)
const emailUser = (process.env.EMAIL_USER || '').replace(/^["']|["']$/g, '').trim();
const emailPass = (process.env.EMAIL_PASS || '').replace(/^["']|["']$/g, '').trim();

if (!emailUser || !emailPass) {
  console.error('[Email] WARNING: EMAIL_USER or EMAIL_PASS is not set!');
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: emailUser,
    pass: emailPass,
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
    console.error('[Email] Fix: Go to Render dashboard > Environment and set EMAIL_USER and EMAIL_PASS without quotes.');
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
