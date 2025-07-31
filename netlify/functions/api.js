const serverless = require('serverless-http');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');

const User = require('../../models/User');
const Message = require('../../models/Message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }, // Allow frontend origin or adjust in production
});

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// REST API Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ message: 'Username and password required' });

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: 'Username already taken' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ message: 'Username and password required' });

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({ token, username: user.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Socket.IO Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: Token required'));
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Authentication error: Invalid token'));
    socket.user = decoded; // Attach user info to socket
    next();
  });
});

// Socket.IO Handlers
io.on('connection', (socket) => {
  console.log(
    `User connected: ${socket.user.username}, socket id: ${socket.id}`
  );

  // Join room event
  socket.on('joinRoom', async (room) => {
    if (!room) return;
    socket.join(room);
    console.log(`${socket.user.username} joined room: ${room}`);

    // Send last 50 messages of room
    try {
      const messages = await Message.find({ room })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
      socket.emit('roomHistory', messages.reverse());
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  });

  // Chat message event
  socket.on('chatMessage', async ({ room, message }) => {
    if (!room || !message) return;

    const newMsg = new Message({
      room,
      username: socket.user.username,
      message,
    });

    try {
      await newMsg.save();
      io.to(room).emit('chatMessage', {
        username: socket.user.username,
        message,
        createdAt: new Date(),
      });
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  // Disconnecting
  socket.on('disconnect', () => {
    console.log(
      `User disconnected: ${socket.user.username}, socket id: ${socket.id}`
    );
  });
});

module.exports.handler = serverless(app);