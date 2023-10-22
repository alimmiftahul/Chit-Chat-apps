import asyncHandler from 'express-async-handler';
import Message from './../models/messageModel.js';
import User from '../models/userModel.js';
import Chat from '../models/chatModel.js';

export const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name pic email')
      .populate('chat');
    if (!messages)
      return res.status(404).json({
        msg: 'messages not found',
      });
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  console.log(content, chatId);

  if (!content || !chatId) {
    console.log('Invalid data passed into request');
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate('sender', 'name pic');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name pic email',
    });

    await Chat.findByIdAndUpdate(chatId, { $set: { latestMessage: message } });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw error;
  }
});
