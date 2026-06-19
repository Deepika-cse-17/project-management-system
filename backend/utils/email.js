const nodemailer = require('nodemailer');

/**
 * Creates a fresh transporter each time using current env vars.
 * This avoids stale credentials if env vars are set after module load.
 */
function createTransporter() {
  const user = (process.env.EMAIL_USER || '').replace(/^["']|["']$/g, '').trim();
  const pass = (process.env.EMAIL_PASS || '').replace(/^["']|["']$/g, '').trim();

  if (!user || !pass) {
    throw new Error(
      'EMAIL_USER or EMAIL_PASS is not set. ' +
      'Go to Render dashboard > your backend service > Environment and add both variables.'
    );
  }

  return nodemailer.createTransport({
    service: 'gmail',   // uses Gmail's built-in config (IPv4 + correct ports)
    auth: { user, pass },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
  });
}

// Log credential status on startup (values never logged, only presence)
const _user = (process.env.EMAIL_USER || '').replace(/^["']|["']$/g, '').trim();
const _pass = (process.env.EMAIL_PASS || '').replace(/^["']|["']$/g, '').trim();
if (!_user || !_pass) {
  console.error('[Email] STARTUP WARNING: EMAIL_USER or EMAIL_PASS missing.');
  console.error('[Email] Emails will fail until these are set on Render.');
} else {
  console.log('[Email] Credentials found at startup for:', _user);
  // Verify connection once on startup
  createTransporter().verify((err) => {
    if (err) {
      console.error('[Email] SMTP verify FAILED at startup:', err.message);
    } else {
      console.log('[Email] SMTP verified OK — emails will work.');
    }
  });
}

async function sendMail({ to, subject, text, html }) {
  console.log('[Email] Sending to:', to, '| Subject:', subject);

  const transporter = createTransporter(); // fresh transporter = current env vars

  const info = await transporter.sendMail({
    from: `ProjectHub <${(process.env.EMAIL_USER || '').replace(/^["']|["']$/g, '').trim()}>`,
    to,
    subject,
    text,
    html,
  });

  console.log('[Email] Sent OK — MessageId:', info.messageId);
  return info;
}

module.exports = { sendMail };
