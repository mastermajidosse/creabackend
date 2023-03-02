import express from 'express';
import {
  createPost,
  getNewPost,
  getPostById,
  getPosts,
  getUserPosts,
  likePost,
} from '../controllers/postControllers.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getPosts).post(protect, createPost);
router.route('/new').get(getNewPost);
router.route('/:id').get(getPostById)
router.route('/user/:id').get(getUserPosts);

router.route('/:postId/toggleLike').put(protect, likePost);

//update and delete

export default router;
