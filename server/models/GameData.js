const mongoose = require('mongoose');

const GameDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  progress: { type: Object, default: {} },
  highScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('GameData', GameDataSchema);
