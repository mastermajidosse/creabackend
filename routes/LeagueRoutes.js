import express from 'express';
import { createLeague, getLeagues } from '../controllers/LeagueControllers.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getLeagues).post(protect,admin, createLeague);

export default router;
