import express, { json } from 'express';
import { chats } from './data/data.js';
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import userRoutes from './routes/userRouter.js';
import chatRoutes from './routes/chatRoutes.js';
import { errorHandler, notFound } from './utils/ErrorHandler.js';

dotenv.config();

const port = process.env.PORT || 8080;

const app = express();

app.use(express.json()); // to accept json data

app.use(
  cors({
    allowedHeaders: ['Content-Type'],
    origin: 'http://localhost:5174',
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

app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
