require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const morgan    = require('morgan');
const sequelize = require('./config/db');
require('./models'); // load all models and associations

const app = express();

app.set('trust proxy', 1); // Required for Render — reads correct IP from X-Forwarded-For

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth',      require('./routes/authRoutes'));
app.use('/api/projects',  require('./routes/projectRoutes'));
app.use('/api/tasks',     require('./routes/taskRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/contact',   require('./routes/contactRoutes'));

// -------------------------------------------------------
// TEST EMAIL ROUTE — visit /api/test-email?to=your@email.com
// Remove this route after confirming email works on Render
// -------------------------------------------------------
app.get('/api/test-email', async (req, res) => {
  const { sendMail } = require('./utils/email');
  const to = req.query.to || process.env.EMAIL_USER;
  try {
    await sendMail({
      to,
      subject: 'ProjectHub — Test Email',
      text: 'This is a test email from ProjectHub backend. Email is working!',
    });
    res.json({ success: true, message: `Test email sent to ${to}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })  // creates tables automatically
  .then(() => {
    console.log('Database connected and synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('DB connection failed:', err));