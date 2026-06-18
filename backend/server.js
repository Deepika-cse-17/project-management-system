require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const morgan    = require('morgan');
const sequelize = require('./config/db');
require('./models'); // load all models and associations

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth',      require('./routes/authRoutes'));
app.use('/api/projects',  require('./routes/projectRoutes'));
app.use('/api/tasks',     require('./routes/taskRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/contact',   require('./routes/contactRoutes'));

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })  // creates tables automatically
  .then(() => {
    console.log('Database connected and synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('DB connection failed:', err));