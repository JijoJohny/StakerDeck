const express = require('express');
const { deposit } = require('../controllers/depositController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { convertAptToUsdt } = require('../controllers/conversionController');

const router = express.Router();

router.post('/deposit', authenticateToken,deposit);
router.post('/convert-apt-to-usdt', convertAptToUsdt);

module.exports = router;
