import express from 'express';
import { assignLeagues, createLeague, getLeagueById, getLeagues } from '../controllers/LeagueControllers.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getLeagues).post(protect,admin, createLeague);
router.route('/:id').get(getLeagueById)
router.route(':id/assign').put(protect,admin,assignLeagues)

export default router;
