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
    posts = await Post.find({ league: leagueId, status: 'done' }).populate(
      'league'
    );
  } else {
    posts = await Post.find({ status: 'done' }).populate('league');
  }
  res.status(200).json(posts);
});
// @desc    create a post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { videoUrl, challenge } = req.body;
  const userId = req.user._id;
  const competitor = await User.findById(userId);
  if (!competitor) {
    res.status(404).json({ message: 'The user does not exist' });
  }
  if (competitor.currentLeague == null || competitor.isCreator == false) {
    res.status(401).json({
      message:
        'You do not belong to any league and do not have the right to create videos',
    });
  }

  const league = competitor.currentLeague;
  const existingPost = await Post.findOne({
    league,
    status: 'waiting',
    creator1: { $ne: competitor._id },
    challenge,
    league,
  });

  const existingChallenge = await Challenge.findById(challenge);

  if (existingPost) {
    // If there's already a post in the league, add the user to the post
    existingPost.creator2 = competitor;
    existingPost.video2 = videoUrl;
    existingPost.thumbnail2 = videoUrl.replace(/\.(mp4|avi|mov|wmv)$/i, '.jpg');
    existingPost.status = 'done';
    existingChallenge.participants.push(existingPost.creator1, competitor);
    await existingChallenge.save();
    await existingPost.save();
    return res.status(200).json(existingPost);
  } else {
    // If there's no existing post, create a new one with creator1 and video1 fields
    const newPost = new Post({
      league,
      creator1: competitor,
      video1: videoUrl,
      thumbnail1: videoUrl.replace(/\.(mp4|avi|mov|wmv)$/i, '.jpg'),
      challenge,
    });
    await newPost.save();
    return res.status(200).json(newPost);
  }
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
    .populate('challenge');
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
  res.status(200).json(posts);
});
export { getPosts, createPost, getNewPost, getUserPosts };
