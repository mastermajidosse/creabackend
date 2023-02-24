import express from 'express';
import {
  createChallenge,
  deleteChallenge,
  getAllChallenges,
  getChallengeById,
  updateChallengeById,
} from '../controllers/challengeControllers.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getAllChallenges).post(protect, admin, createChallenge);
router
  .route('/:id')
  .get(getChallengeById)
  .put(protect,admin,updateChallengeById)
  .delete(protect, admin, deleteChallenge);

export default router;
