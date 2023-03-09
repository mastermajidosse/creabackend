import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Challenge from '../models/Challenge.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

// @desc    Fetch all posts
// @route   GET /api/posts?league=league
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const leagueId = req.query.league;

  let posts;
  if (leagueId) {
    posts = await Post.find({ league: leagueId, status: 'done' })
      .populate('league')
      .populate('comments.user', 'name image isAdmin');
  } else {
    posts = await Post.find({ status: 'done' })
      .populate('league')
      .populate('comments.user', 'name image isAdmin');
  }
  res.status(200).json(posts);
});
// @desc    create a post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { videoUrl, challenge } = req.body;
  const userId = req.user._id;
  const [competitor, existingChallenge] = await Promise.all([
    User.findById(userId),
    Challenge.findById(challenge),
  ]);
  if (!competitor) {
    return res.status(404).json({ message: 'The user does not exist' });
  }
  if (!existingChallenge) {
    return res.status(404).json({ message: 'No challenge Found' });
  }
  const allowedLeague = existingChallenge.league;
  const league = competitor.currentLeague;
  if (
    allowedLeague.toString() !== league.toString() ||
    !competitor.isCreator ||
    existingChallenge.status === 'done' //need to make sure that it is working
  ) {
    return res.status(401).json({
      message: 'You do not have permission to participate in this challenge',
    });
  }
  const existingPost = await Post.findOneAndUpdate(
    {
      league,
      status: 'waiting',
      creator1: { $ne: competitor._id },
      challenge,
      league,
    },
    {
      creator2: competitor,
      video2: videoUrl,
      thumbnail2: videoUrl.replace(/\.(mp4|avi|mov|wmv)$/i, '.jpg'),
      status: 'done',
    },
    {
      new: true,
      upsert: false,
    }
  );
  if (existingPost) {
    existingChallenge.participants.push(existingPost.creator1, competitor);
    const [savedChallenge, savedPost] = await Promise.all([
      existingChallenge.save(),
      existingPost.save(),
    ]);
    return res
      .status(200)
      .json(await savedPost.populate('comments.user', 'name image isAdmin'));
  } else {
    const newPost = new Post({
      league,
      creator1: competitor,
      video1: videoUrl,
      thumbnail1: videoUrl.replace(/\.(mp4|avi|mov|wmv)$/i, '.jpg'),
      challenge,
    });
    await Promise.all([existingChallenge.save(), newPost.save()]);
    return res.status(200).json({ newPost });
  }
});

// @desc    Get a post by its Id
// @route   Get /api/posts/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id)
    .populate({
      path: 'creator1',
    })
    .populate({
      path: 'creator2',
    });
  if (post) {
    res.status(200).json(post).populate('comments.user', 'name image isAdmin');
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// @desc    delete a post by its Id
// @route   DELETE /api/posts/:id
// @access  Private || Admin
const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const post = await Post.findById(id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: `No Post with id: ${id}` });
  }

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (
    post.creator1.toString() !== userId &&
    post.creator2.toString() !== userId &&
    !req.user.isAdmin
  ) {
    return res
      .status(403)
      .json({ message: 'You are not authorized to delete this post' });
  }

  await post.remove();
  res.status(201).json({ message: 'Post removed' });
});

// @desc    get a single new post
// @route   POST /api/posts/new
// @access  Public
const getNewPost = asyncHandler(async (req, res) => {
  const league = req.query.league
    ? {
        league: mongoose.Types.ObjectId(req.query.league),
        status: 'done',
      }
    : {
        status: 'done',
      };
  const count = await Post.countDocuments({ ...league });
  const randomIndex = Math.floor(Math.random() * count);
  const post = await Post.findOne({ ...league })
    .skip(randomIndex)
    .populate('league')
    .populate('challenge')
    .populate('comments.user', 'name image isAdmin');
  if (!post) {
    return res.status(404).json({ message: 'No matching post found' });
  }
  res.status(200).json(post);
});

// @desc    get user's posts
// @route   POST /api/posts/user/:id
// @access  Public
const getUserPosts = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const posts = await Post.find({
    $or: [{ creator1: userId }, { creator2: userId }],
  });
  res.status(200).json(posts).populate('comments.user', 'name image isAdmin');
});
// @desc    Like a post
// @route   POST /api/posts/:id/llike
// @access  Private
const likePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  const user = await User.findById(userId);

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).send('Post not found');
  }

  const alreadyLiked = post.likes.some((like) => like.toString() === userId);

  if (alreadyLiked) {
    post.likes = post.likes.filter((like) => like.toString() !== userId);
    post.likeCount = post.likeCount - 1;
    user.likedPosts.filter((post) => post.toString() !== postId);
    await post.save();
    await user.save();
    return res.json({ message: 'Like removed successfully' });
  } else {
    post.likes.push(userId);
    post.likeCount = post.likeCount + 1;
    user.likedPosts.push(post._id);
    await post.save();
    await user.save();
    return res.json({ message: 'Like added successfully' });
  }
});

// @desc    Add a comment to a post
// @route   PUT /api/posts/:postId/comment
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  const { content } = req.body;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const comment = {
    user: userId,
    content,
    likes: [],
  };

  post.comments.push(comment);
  await post.save();

  return res.json({ message: 'Comment added successfully' });
});

// @desc    Remove a comment from a post
// @route   DELETE /api/posts/:id/comment/:commentId
// @access  Private
const removeComment = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  const userId = req.user.id;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const comment = post.comments.find((c) => c._id.toString() === commentId);

  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  // Check if the user is the owner of the comment or an admin
  if (comment.user.toString() !== userId && req.user.isAdmin !== true) {
    return res
      .status(401)
      .json({ message: 'Not authorized to remove this comment' });
  }

  post.comments = post.comments.filter((c) => c.id !== commentId);
  await post.save();

  return res.json({ message: 'Comment removed successfully' });
});

// @desc    Like a comment
// @route   PUT /api/posts/:id/comment/:commentId/like
// @access  Private
const likeComment = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  const userId = req.user.id;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const comment = post.comments.find((c) => c.id === commentId);

  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  const alreadyLiked = comment.likes.some((like) => like.toString() === userId);

  if (alreadyLiked) {
    comment.likes = comment.likes.filter((like) => like.toString() !== userId);
  } else {
    comment.likes.push(userId);
  }

  await post.save();

  return res.json({ message: "Comment's like toggled successfully" });
});

// @desc    vote on a post
// @route   POST /api/posts/:postId/vote/:winner
// @access  Private
const vote = asyncHandler(async (req, res) => {
  const { postId, winner } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(404).json({ message: `No Post with id: ${postId}` });
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: `No Post with id: ${postId}` });
  }

  if (post.status !== 'done') {
    return res
      .status(401)
      .json({ message: 'You cannot vote on a post with only one user' });
  }

  const challenge = await Challenge.findById(post.challenge);

  if (!challenge || challenge.status === 'done') {
    return res
      .status(401)
      .json({ message: 'You are not authorized to vote on this challenge' });
  }

  const existingVote = post.votes.find(
    (vote) => vote.user.toString() === userId
  );

  if (existingVote) {
    existingVote.winner = winner;
  } else {
    post.votes.push({ user: userId, winner });
  }
  await post.save();
  return res.status(201).json({ message: 'voted with success' });
});

// @desc    get wins of a user
// @route   POST /api/posts/wins/:userId
// @access  Public
const getWinPosts = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const posts = await Post.find({
    $or: [{ creator1: userId }, { creator2: userId }],
    winner: userId,
    status: 'done',
  });
  res.status(200).json(posts);
});

export {
  getPosts,
  createPost,
  getNewPost,
  getUserPosts,
  likePost,
  getPostById,
  deletePost,
  addComment,
  removeComment,
  likeComment,
  vote,
  getWinPosts,
};
