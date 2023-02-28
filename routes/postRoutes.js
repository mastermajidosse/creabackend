import express from 'express';
import { createPost, getNewPost, getPosts, getUserPosts } from '../controllers/postControllers.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getPosts).post(protect, createPost);
router.route('/new').get(getNewPost);
router.route('/user/:id').get(getUserPosts)

export default router;
