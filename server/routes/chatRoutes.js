import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  accessChat,
  getChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
} from '../controllers/chatController.js';

const router = express.Router();

router.route('/').post(protect, accessChat).get(protect, getChats);
router.route('/group').post(protect, createGroupChat);
router.route('/grouprename').put(protect, renameGroupChat);
router.route('/groupaddmember').put(protect, addToGroup);
router.route('/groupremovemember').put(protect, removeFromGroup);

export default router;
