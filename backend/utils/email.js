const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,           // port 465 requires secure: true
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
});

// Verify SMTP connection on startup — logs clearly if credentials are wrong
transporter.verify((err) => {
  if (err) {
    console.error('SMTP connection failed:', err.message);
    console.error('Check EMAIL_USER and EMAIL_PASS environment variables on Render.');
  } else {
    console.log('SMTP connection verified — email is ready');
  }
});

async function sendMail({ to, subject, text, html }) {
  console.log('[Email] Sending to:', to, '| Subject:', subject);

  const mailOptions = {
    from: `ProjectHub <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[Email] Sent successfully. MessageId:', info.messageId);
    return info;
  } catch (err) {
    console.error('[Email] Failed to send to', to, ':', err.message);
    throw err; // re-throw so callers know it failed
  }
}

module.exports = { sendMail, transporter };
