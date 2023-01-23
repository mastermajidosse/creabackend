import express from 'express';
import {
	getPosts,
	createPost,
	getPostById,
	editPostById,
	deletePost,
	likePost,
	reportPost,
	getReports,
	deleteReport,
	getPostsByUserId,
	editNews,
	deleteNews,
	getNews,
	addNews,
	approvePost,
	switchTop3,
	translatePost,
	createComment,
	updateComment,
	deleteComment,
} from '../controllers/postControllers.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getPosts).post(protect, createPost);

router
	.route('/:id')
	.get(getPostById)
	.post(protect, editPostById)
	.delete(protect, deletePost);

router.route('/user/:id').get(getPostsByUserId);

router.route('/:id/like').post(protect, likePost);

// comment routes
router.route('/:id/comment').post(protect, createComment);
router
	.route('/:id/comment/:comment_id')
	.patch(protect, updateComment)
	.delete(protect, deleteComment);

// report routes
router
	.route('/:id/report')
	.post(protect, reportPost)
	.get(protect, admin, getReports);

router.route('/:id/report/:report_id').delete(protect, admin, deleteReport);

router.route('/:id/translate').post(protect, admin, translatePost);

router.route('/:id/update').post(protect, addNews).get(protect, getNews);

router
	.route('/:id/update/:update_id')
	.post(protect, editNews)
	.delete(protect, deleteNews);

router.route('/:id/approve').post(protect, admin, approvePost);

router.route('/:id/top3').post(protect, admin, switchTop3);

export default router;
