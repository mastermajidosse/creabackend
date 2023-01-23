import asyncHandler from 'express-async-handler';
import Post from '../models/Post.js';
import User from '../models/User.js';

// @desc    Fetch all posts
// @route   GET /api/posts?status=status
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
	const status = req.query.status
		? {
			status: {
				$regex: req.query.status,
				$options: 'i',
			},
		}
		: {};
	const posts = await Post.find({ ...status })
		.sort({ createdAt: -1 })
		.populate({
			path: 'category',
			select: '-updatedAt -createdAt -_id -__v',
		});
	res.status(200).json(posts);
});
// @desc    create a post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
	const { lang, title, desc, category, price, deadline, images, link } =
		req.body;
	const user = req.user._id;



	const post = new Post();
	post.title.en = title;
	post.desc.en = desc;

	post.link = link || '';
	post.lang = lang;
	post.category = category;
	// post.deadline = deadline;
	post.images = images;
	post.user = user;
	const createdPost = await post.save();
	res.status(201).json(createdPost);
});

// @desc    translate a post
// @route   POST /api/posts/:id/translate
// @access  Private
const translatePost = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id);
	const { title, desc } = req.body;
	if (post) {
		if (post.lang) {
			post.title.ar = title;
			post.desc.ar = desc;
		} else {
			post.title.en = title;
			post.desc.en = desc;
		}
		const modifiedPost = await post.save();
		res.status(200).json(modifiedPost);
	} else {
		res.status(404).json({ message: 'Post not found' });
	}
});

// @desc    Get a post by its Id
// @route   Get /api/posts/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const post = await Post.findById(id)
		.populate({
			path: 'user',
			select: '-password -savedPosts -updatedAt -createdAt -_v',
		})
		.populate({
			path: 'category',
			select: '-updatedAt -createdAt _id -__v',
		})
		.populate({
			path: 'comments.author',
			select:
				'-updatedAt -password -savedPosts -isAdmin -reports -blocked -email -verified -__v',
		});
	if (post) {
		res.status(200).json(post);
	} else {
		res.status(404).json({ message: 'Post not found' });
	}
});
// @desc    Get posts by its user Id
// @route   Get /api/posts/user/:id
// @access  Public
const getPostsByUserId = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const posts = await Post.find({ user: id }).sort({ createdAt: -1 }).populate({
		"path": "category",
	});
	if (posts) {
		res.status(200).json(posts);
	} else {
		res.status(404).json({ message: 'Posts not found' });
	}
});

// @desc    Edit a post by its Id
// @route   POST /api/posts/:id
// @access  Private
const editPostById = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { title, desc, category, images } = req.body;

	const post = await Post.findById(id);
	if (post) {
		if (post.user.toString() == req.user._id || req.user.isAdmin === true) {


			post.title.en = title || post.title.en;
			post.desc.en = desc || post.desc.en;
			post.category = category || post.category;
			post.images = images || post.images;

			const updatedPost = await post.save();
			res.status(201).json(updatedPost);
		} else {
			res
				.status(401)
				.json({ message: 'you are not authorized to edit this project' });
		}
	} else {
		res.status(404).json({ message: 'Post not found...' });
	}
});
// @desc    Delete a post by its Id
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const post = await Post.findById(id);

	if (post) {
		if (post.user.toString() == req.user._id || req.user.isAdmin === true) {
			await post.remove();
			res.status(201).json({ message: 'Post removed' });
		} else {
			res
				.status(401)
				.json({ message: 'you are not authorized to delete this project' });
		}
	} else {
		res.status(404).json({ message: 'Post not found...' });
	}
});

//Updates part
// @desc    GEt News
// @route   Get /api/posts/:id/update
// @access  Public
const getNews = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const post = await Post.findById(id);
	if (post) {
		res.status(200).json(post.updates);
	} else {
		res.status(404).json({ message: 'Post not found...' });
	}
});

// @desc    add news
// @route   POST /api/posts/:id/update
// @access  Private
const addNews = asyncHandler(async (req, res) => {
	const { title, desc, images } = req.body;
	const { id } = req.params;

	const post = await Post.findById(id);
	if (post) {
		if (post.user.toString() == req.user._id || req.user.isAdmin === true) {
			post.updates.push({ title, desc, images });
			const updatedPost = await post.save();
			res.status(201).json(updatedPost);
		} else {
			res.status(401).json({
				message: 'you are not authorized to add an update of this project',
			});
		}
	} else {
		res.status(404).json({ message: 'Post not found...' });
	}
});

// @desc    edit news
// @route   POST /api/posts/:id/update/:update_id
// @access  Private
const editNews = asyncHandler(async (req, res) => {
	const { id, update_id } = req.params;
	const { title, desc, images } = req.body;
	const post = await Post.findById(id);
	if (post) {
		if (post.user.toString() == req.user._id || req.user.isAdmin === true) {
			const update = post.updates.find((post) => (post._id = update_id));
			if (update) {
				update.title = title || update.title;
				update.desc = desc || update.desc;
				update.images = images || update.images;
			}
			const updatedPost = await post.save();
			res.status(201).json(updatedPost);
		} else {
			res.status(401).json({
				message: 'you are not authorized to edit an update of this project',
			});
		}
	} else {
		res.status(404).json({ message: 'Post not found...' });
	}
});
// @desc    delete news
// @route   POST /api/posts/:id/update/:update_id/delete
// @access  Private
const deleteNews = asyncHandler(async (req, res) => {
	const { id, update_id } = req.params;
	const post = await Post.findById(id);
	if (post) {
		if (post.user.toString() == req.user._id || req.user.isAdmin === true) {
			const update = post.updates.find((post) => (post._id = update_id));
			if (update) {
				post.updates = post.updates.filter((post) => post._id != update_id);
			}
			await post.save();
			res.status(201).json({ message: 'Update removed' });
		} else {
			res.status(401).json({
				message: 'you are not authorized to delete an update of this project',
			});
		}
	} else {
		res.status(404).json({ message: 'post not found...' });
	}
});
// @desc    like a post
// @route   POST /api/posts/:id/like
// @access  Private
const likePost = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const post = await Post.findById(id);
	const user = await User.findById(req.user._id);

	if (!user) {
		return res
			.status(401)
			.json({ message: 'you are not authorized, You need to login first' });
	}
	const index = post.likes.findIndex((id) => id === String(req.user._id));
	if (index === -1) {
		post.likes.push(req.user._id);
		user.savedPosts.push(post._id);
	} else {
		post.likes = post.likes.filter((id) => id !== String(req.user._id));
		user.savedPosts.filter((id) => id != String(post._id));
	}

	await user.save();
	const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

	res.status(201).json(updatedPost);
});
// @desc    Report a post
// @route   POST /api/posts/:id/report
// @access  Private
const reportPost = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { title, desc, images } = req.body;
	const post = await Post.findById(id);
	let exist = 0;
	if (post) {
		post.reports.map((report) => {
			if (report.reporter == String(req.user._id)) {
				exist++;
			}
		});
		if (exist != 0) {
			res.status(401).json({ message: 'You can report a post only once' });
		} else {
			post.reports.push({ title, desc, images, reporter: req.user._id });
			const reportedPost = await post.save();
			res.status(201).json(reportedPost);
		}
	} else {
		res.status(404).json({ message: 'Post not found...' });
	}
});

// @desc    GEt reports of a spicific post
// @route   Get /api/posts/:id/report
// @access  Private
const getReports = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const post = await Post.findById(id).sort({ createdAt: -1 });
	if (post) {
		if (post.user.toString() == req.user._id || req.user.isAdmin === true) {
			res.status(200).json(post.reports);
		} else {
			res.status(401).json({
				message: 'You are not allowed to access the report of other user',
			});
		}
	} else {
		res.status(404).json({ message: 'Post not found...' });
	}
});
// @desc    delete an update
// @route   POST /api/posts/:id/update/:update_id/delete
// @access  Private
const deleteReport = asyncHandler(async (req, res) => {
	const { id, report_id } = req.params;
	const post = await Post.findById(id);
	if (post) {
		const report = post.reports.find((post) => (post._id = report_id));
		if (report) {
			post.reports = post.reports.filter((report) => report._id != report_id);
		}
		await post.save();
		res.status(201).json({ message: 'Report was deleted successfully.' });
	} else {
		res.status(404).json({ message: 'post not found...' });
	}
});

// @desc    Approve a post
// @route   POST /api/posts/:id/approve
// @access  Private/admin
const approvePost = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (post) {
		post.status = 'approved';
		await post.save();
		res.status(201).json({ message: 'Project approved successfully' });
	} else {
		res.status(404).json({ message: 'Project not found' });
	}
});

// @desc    Add/Remove to/from top3 section
// @route   POST /api/posts/:id/top3
// @access  Private/admin
const switchTop3 = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (post) {
		post.status = post.status === 'top3' ? '' : 'top3';
		await post.save();
		res.status(201).json({ message: 'Project switched successfully' });
	} else {
		res.status(404).json({ message: 'Project not found' });
	}
});

// @desc    create comment
// @route   POST /api/posts/:id/comment
// @access  Private
const createComment = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { comment } = req.body;
	const post = await Post.findById(id);
	// console.log('post: ', post);
	if (post) {
		// const isAlreadyCommented = post.comments.find(
		// 	(comment) => comment.author == String(req.user._id),
		// );
		// if (!isAlreadyCommented) {
		// 	res.status(401).json({ message: 'You can comment a post only once' });
		// } else {
		// }
		post.comments.unshift({ comment, author: req.user._id });
		const commentedPost = await post.save();
		res.status(201).json({ message: 'Comment created successfully.' });
	} else {
		res.status(404).json({ message: 'Post not found...' });
	}
});
// @desc    update comment
// @route   POST /api/posts/:id/comment/:comment_id
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
	const { id, comment_id } = req.params;
	const { comment } = req.body;
	const post = await Post.findById(id);
	// console.log('Post: ', post);
	if (post) {
		// if (post.user.toString() !== req.user._id || req.user.isAdmin === false) {
		// 	return res
		// 		.status(401)
		// 		.json({ message: 'You are not authorized to update this comment.' });
		// }
		const oldComment = post.comments.find(
			(comment) => (comment._id = comment_id),
		);
		// console.log('oldComment: ', oldComment);
		if (oldComment) {
			oldComment.comment = comment;
			console.log('oldComment: ', oldComment);
			const projectComments = post.comments
				.filter((comment) => comment._id == comment_id)
				.unshift({ comment, author: req.user._id });
			post.comments = projectComments;
			console.log('Comments: ', post.comments);
			await post.save();
			res.status(201).json({
				// comments: updatedPost.comments,
				message: 'Comment is updated successfully.',
			});
		} else {
			res.status(404).json({ message: 'comment not found...' });
		}
	} else {
		res.status(404).json({ message: 'Post not found...' });
	}
});
// @desc    delete comment
// @route   POST /api/posts/:id/comment/:comment_id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
	const { id, comment_id } = req.params;

	const post = await Post.findById(id);
	if (!post) return res.status(404).json({ message: 'post not found...' });

	const commentToDelete = post?.comments?.find(
		(comment) => comment._id == comment_id,
	);

	if (!commentToDelete)
		return res.status(404).json({ message: 'Comment not found...' });

	if (String(commentToDelete?.author) != String(req?.user?._id)) {
		return res
			.status(401)
			.json({ message: 'You are not authorized to delete this comment.' });
	}

	post.comments = post?.comments?.filter(
		(comment) => comment._id.toString() !== comment_id,
	);

	await post.save();

	res.status(201).json({ message: 'Comment was deleted successfully.' });
});

export {
	getPosts,
	createPost,
	getPostById,
	editPostById,
	deletePost,
	addNews,
	getNews,
	editNews,
	deleteNews,
	likePost,
	reportPost,
	getReports,
	deleteReport,
	getPostsByUserId,
	approvePost,
	switchTop3,
	translatePost,
	createComment,
	deleteComment,
	updateComment,
};
