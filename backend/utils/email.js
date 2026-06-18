const nodemailer = require('nodemailer');

// Transporter uses environment variables EMAIL_USER and EMAIL_PASS
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Use an explicit display name if provided via EMAIL_FROM, otherwise fall back to EMAIL_USER
function getFromAddress() {
  if (process.env.EMAIL_FROM && process.env.EMAIL_FROM.trim().length > 0) return process.env.EMAIL_FROM;
  return process.env.EMAIL_USER;
}

async function sendMail({ to, subject, text, html }) {
  const from = getFromAddress();
  console.log('Email send requested. transporter user:', process.env.EMAIL_USER);
  console.log('Mail from (used):', from, 'to:', to, 'subject:', subject);

  const mailOptions = {
    from: {
      name: 'ProjectHub',
      address: process.env.EMAIL_USER,
    },
    replyTo: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendMail, transporter };
