import express from 'express';
import {
  addComment,
  createPost,
  deletePost,
  getNewPost,
  getPostById,
  getPosts,
  getUserPosts,
  likeComment,
  likePost,
  removeComment,
  vote,
} from '../controllers/postControllers.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getPosts).post(protect, createPost);
router.route('/new').get(getNewPost);
router.route('/:id').get(getPostById).delete(protect, deletePost);
router.route('/user/:id').get(getUserPosts);

router.route('/:postId/toggleLike').put(protect, likePost);

router.route('/:postId/comment').put(protect, addComment);
router.route('/:postId/comment/:commentId').delete(protect, removeComment);
router.route('/:postId/comment/:commentId/like').put(protect, likeComment);

router.route('/:postId/vote/:winner').put(protect,vote);

//update and delete

export default router;
