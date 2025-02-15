const express = require('express');
const { saveProgress, getLeaderboard } = require('../controllers/gameController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

router.post('/save', authMiddleware, saveProgress);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
