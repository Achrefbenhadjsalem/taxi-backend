const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config');
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');
const messageRoutes = require('./routes/messageRoutes');
const contactRoutes = require('./routes/contactRoutes');
const superadminRoutes = require('./routes/superadminRoutes'); // Import superadmin routes
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const Message = require('./models/Message');
const User = require('./models/User');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configure CORS to allow requests from 'http://localhost:3001'
app.use(cors({
  origin: 'http://localhost:3001'
}));

app.use(bodyParser.json());

// Use routes
app.use('/api/users', userRoutes);
app.use('/api', tripRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', contactRoutes);
app.use('/api/superadmin', superadminRoutes); // Use superadmin routes

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false })  // Change to `true` if you want to drop and recreate tables
  .then(() => {
    console.log('Database & tables created!');
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', async (data) => {
    const { content, senderId, receiverId } = data;

    try {
      const message = await Message.create({
        content,
        senderId,
        receiverId
      });

      io.emit('message', message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Remove this duplicate server.listen call
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
