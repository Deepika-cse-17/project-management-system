const express    = require('express');
const router     = express.Router();
const ctrl       = require('../controllers/dashboardController');
const authMiddle = require('../middleware/authMiddleware');

router.get('/', authMiddle, ctrl.getStats);

module.exports = router;