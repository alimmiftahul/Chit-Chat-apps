import Chat from './../models/chatModel.js';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// Create or access a chat with another user
export const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log('UserId param not sent with request');
    return res.sendStatus(400);
  }

  // Check if a chat already exists with the specified users
  const chatExists = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [req.user._id, userId] },
  });

  if (chatExists) {
    return res.send(chatExists);
  }

  // Create a new chat if it doesn't exist
  const chatData = {
    chatName: 'sender',
    isGroupChat: false,
    users: [req.user._id, userId],
  };

  try {
    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findOne({ _id: createdChat._id })
      .populate('users', '-password')
      .populate('latestMessage.sender', 'name pic email');

    res.status(200).json(fullChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Get a user's chats
export const getChats = asyncHandler(async (req, res) => {
  try {
    const userChats = await Chat.find({
      users: req.user._id,
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage.sender', 'name pic email')
      .sort({ updatedAt: -1 });

    res.status(200).send(userChats);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Create a group chat
export const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: 'Please fill all the fields' });
  }

  const users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send('At least 2 users are required to form a group chat');
  }

  // Check if the user is trying to add themselves
  if (users.includes(req.user._id.toString())) {
    return res
      .status(400)
      .send('You cannot add yourself to the group, you already there');
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!updatedChat) {
    res.status(404).json({ error: 'Chat Not Found' });
  } else {
    res.json(updatedChat);
  }
});

export const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // Check if the user is already in the group
  const chat = await Chat.findById(chatId);

  if (!chat) {
    res.status(404);
    throw new Error('Chat Not Found');
  }
  if (chat.users.includes(userId)) {
    res.status(400);
    throw new Error('User is already in the group');
  }

  // check if the requester is admin
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!added) {
    res.status(404);
    throw new Error('Chat Not Found');
  } else {
    res.json(added);
  }
});

export const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!removed) {
    res.status(404);
    throw new Error('Chat Not Found');
  } else {
    res.json(removed);
  }
});
