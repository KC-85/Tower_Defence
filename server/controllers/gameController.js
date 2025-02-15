const GameData = require('../models/GameData');
const User = require('../models/User');

/**
 * Save user game progress and high score
 */
const saveProgress = async (req, res) => {
    const { userId, progress, highScore } = req.body;

    try {
        let gameData = await GameData.findOne({ userId });

        if (gameData) {
            // Update existing progress
            gameData.progress = progress;
            gameData.highScore = Math.max(gameData.highScore, highScore);
            await gameData.save();
        } else {
            // Create new progress record
            gameData = await GameData.create({ userId, progress, highScore });
        }

        // Update user's high score in the User model
        await User.findByIdAndUpdate(userId, { highScore: gameData.highScore });

        res.status(200).json({ message: 'Progress saved successfully', gameData });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Get the leaderboard (top 10 players)
 */
const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await GameData.find()
            .sort({ highScore: -1 }) // Sort by highest score
            .limit(10) // Limit to top 10
            .populate('userId', 'username highScore'); // Get username from User model

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { saveProgress, getLeaderboard };
