import express from 'express';
import { createPost, getPosts } from '../controllers/postControllers.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getPosts).post(protect, createPost);

export default router;
