import express from 'express';
import {
  assignLeagueToUser,
  deleteUser,
  getUserById,
  getUserProfile,
  getUsers,
  login,
  makeUserCreator,
  register,
  updateUserProfile,
} from '../controllers/userControllers.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.route('/login').post(login);
router.route('/register').post(register);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, getUserById);

router.route('/create').put(protect, makeUserCreator);

router.route('/:id/league').put(protect, admin, assignLeagueToUser);

export default router;
