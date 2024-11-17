require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const database = require('./config/database');
const authRoutes = require('./routes/auth');
const locationRoutes = require('./routes/location');
const setupSocketIO = require('./services/socketService');

const app = express();
const server = http.createServer(app);

const connectDB = database();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth', authRoutes);
app.use('/api/location', locationRoutes);

const io = setupSocketIO(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));