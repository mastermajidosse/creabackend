import express from 'express';
import {
  createSeason,
  getSeasonById,
  getSeasons,
} from '../controllers/seasonControllers.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getSeasons).post(protect, admin, createSeason);
router.route('/:id').get(getSeasonById);

export default router;
