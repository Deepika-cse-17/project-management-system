const { sendMail } = require('../utils/email');

exports.sendContactMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    await sendMail({
      to: process.env.EMAIL_USER,
      subject: `Contact message: ${subject}`,
      text: `You have a new contact message from ${name} <${email}>:\n\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br/>')}</p>`,
    });
    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact email failed', err);
    res.status(500).json({ message: 'Unable to send message. Please try again later.' });
  }
};
