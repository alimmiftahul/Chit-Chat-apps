import express, { json } from 'express';
import { chats } from './data/data.js';
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import userRoutes from './routes/userRouter.js';
import chatRoutes from './routes/chatRoutes.js';
import { errorHandler, notFound } from './utils/ErrorHandler.js';
import messageRoutes from './routes/messageRoutes.js';
import path from 'path';
import { Server } from 'socket.io';

dotenv.config();
const __dirname1 = path.resolve();

const port = process.env.PORT || 8080;

const app = express();

app.use(express.json()); // to accept json data

app.use(
  cors({
    allowedHeaders: ['Content-Type'],
    origin: 'http://localhost:5173' || 'http://localhost:5173',
    methods: ['POST', 'GET', 'PATCH', 'DELETE', 'PUT'],
  })
);

connectDB();

app.use(express.json()); // to accept json data

app.get('/api/chats', (req, res) => {
  res.send(chats);
});

app.get('/api/chats/:id', (req, res) => {
  const singleChat = chats.find((chat) => chat._id === req.params.id);
  res.send(singleChat);
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:5173',
    // credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('Connected to socket.io');
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User Joined Room: ' + room);
  });
  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit('message recieved', newMessageRecieved);
    });
  });

  socket.off('setup', () => {
    console.log('USER DISCONNECTED');
    socket.leave(userData._id);
  });
});
