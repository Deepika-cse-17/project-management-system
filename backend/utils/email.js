const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

function getFromAddress() {
  return process.env.EMAIL_FROM || process.env.EMAIL_USER;
}

async function sendMail({ to, subject, text, html }) {
  const from = getFromAddress();

  console.log('Email send requested:', process.env.EMAIL_USER);

  const mailOptions = {
    from: `ProjectHub <${process.env.EMAIL_USER}>`,
    replyTo: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendMail, transporter };