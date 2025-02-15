const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('./utils/db');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());
app.use(cors());

// ✅ Default Route for Browser Testing
app.get('/', (req, res) => {
    res.send('✅ Tower Defense Server is Running!');
});

// Routes
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');

app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
