import express from 'express';
import {
  registerUser,
  authUser,
  getAllUsers,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/login').post(authUser);
router.route('/').post(registerUser).get(protect, getAllUsers);

export default router;
