/**
 * email.js
 *
 * Uses Resend (https://resend.com) if RESEND_API_KEY is set — works reliably
 * on all cloud platforms with no SMTP port issues.
 *
 * Falls back to Gmail SMTP if only EMAIL_USER / EMAIL_PASS are set.
 *
 * Set on Render dashboard (Environment tab):
 *   RESEND_API_KEY  =  re_xxxxxxxxxxxxxxxxxxxx   ← preferred
 *   EMAIL_USER      =  supportprojecthub@gmail.com
 *   EMAIL_PASS      =  <16-char Gmail App Password>
 */

const nodemailer = require('nodemailer');

// ─── helpers ────────────────────────────────────────────────────────────────
const clean = (v) => (v || '').replace(/^["']|["']$/g, '').trim();

function gmailTransporter() {
  const user = clean(process.env.EMAIL_USER);
  const pass = clean(process.env.EMAIL_PASS);
  if (!user || !pass) throw new Error('EMAIL_USER or EMAIL_PASS not set.');
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    family: 4,            // force IPv4 — Render free tier blocks IPv6
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
  });
}

// ─── startup log ────────────────────────────────────────────────────────────
const hasResend = !!clean(process.env.RESEND_API_KEY);
const hasGmail  = !!(clean(process.env.EMAIL_USER) && clean(process.env.EMAIL_PASS));

if (hasResend) {
  console.log('[Email] Using Resend API — will send reliably on Render.');
} else if (hasGmail) {
  console.log('[Email] Using Gmail SMTP for:', clean(process.env.EMAIL_USER));
  gmailTransporter().verify((err) => {
    if (err) console.error('[Email] Gmail SMTP verify FAILED:', err.message);
    else     console.log('[Email] Gmail SMTP verified OK.');
  });
} else {
  console.error('[Email] WARNING: No email credentials set. Set RESEND_API_KEY on Render.');
}

// ─── sendMail ────────────────────────────────────────────────────────────────
async function sendMail({ to, subject, text, html }) {
  console.log('[Email] Sending to:', to);

  const resendKey = clean(process.env.RESEND_API_KEY);

  // ── Option 1: Resend API (recommended for Render) ──
  if (resendKey) {
    const { Resend } = require('resend');
    const resend = new Resend(resendKey);

    const fromAddress = clean(process.env.EMAIL_USER) || 'noreply@projecthub.app';

    const { data, error } = await resend.emails.send({
      from: `ProjectHub <onboarding@resend.dev>`, // use resend dev domain until you verify yours
      to,
      subject,
      text,
      html,
    });

    if (error) {
      console.error('[Email] Resend error:', error);
      throw new Error(error.message || 'Resend failed');
    }

    console.log('[Email] Sent via Resend. ID:', data.id);
    return data;
  }

  // ── Option 2: Gmail SMTP fallback ──
  if (hasGmail || (clean(process.env.EMAIL_USER) && clean(process.env.EMAIL_PASS))) {
    const transporter = gmailTransporter();
    const info = await transporter.sendMail({
      from: `ProjectHub <${clean(process.env.EMAIL_USER)}>`,
      to,
      subject,
      text,
      html,
    });
    console.log('[Email] Sent via Gmail SMTP. MessageId:', info.messageId);
    return info;
  }

  throw new Error(
    'No email provider configured. Set RESEND_API_KEY on Render dashboard.'
  );
}

module.exports = { sendMail };
