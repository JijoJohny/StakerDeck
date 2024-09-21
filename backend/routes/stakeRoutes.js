const express = require('express');
const router = express.Router();
const { stake, claimRewards } = require('../controllers/stakeController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, stake);
router.post('/claim-rewards',authenticateToken, claimRewards);

module.exports = router;
