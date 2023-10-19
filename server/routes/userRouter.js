import express from 'express';
import {
  registerUser,
  authUser,
  getAllUsers,
} from '../controllers/userController.js';

const router = express.Router();

router.route('/login').post(authUser);
router.route('/').post(registerUser).get(getAllUsers);

export default router;
