import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import League from '../models/League.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { validateRegisterInput } from '../utils/validators.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    login
// @route   GET /api/users/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ $or: [{ email }, { name }] });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      country: user.country,
      image: user.image,
      likedPosts: user.likedPosts,
      followers: user.followers,
      following: user.following,
      wins: user.wins,
      loses: user.loses,
      draws: user.draws,
      isCreator: user.isCreator,
      currentLeague: user.currentLeague,
      initialCountFollowers: user.initialCountFollowers,
      verified: user.verified,
      blocked: user.blocked,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});
// @desc    register
// @route   GET /api/users/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, country } = req.body;

  const errors = validateRegisterInput(
    name,
    email,
    password,
    confirmPassword,
    country
  );

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    country,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      country: user.country,
      image: user.image,
      likedPosts: user.likedPosts,
      followers: user.followers,
      following: user.following,
      wins: user.wins,
      loses: user.loses,
      draws: user.draws,
      isCreator: user.isCreator,
      currentLeague: user.currentLeague,
      initialCountFollowers: user.initialCountFollowers,
      verified: user.verified,
      blocked: user.blocked,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    res.json({ message: 'Invalid user data' });
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      country: user.country,
      image: user.image,
      likedPosts: user.likedPosts,
      followers: user.followers,
      following: user.following,
      wins: user.wins,
      loses: user.loses,
      draws: user.draws,
      isCreator: user.isCreator,
      currentLeague: user.currentLeague,
      initialCountFollowers: user.initialCountFollowers,
      verified: user.verified,
      blocked: user.blocked,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private

const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, country, phone, image } =
    req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.country = country || user.country;
  user.phone = phone || user.phone;
  user.image = image || user.image;

  if (password && password == confirmPassword) {
    user.password = password;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    isAdmin: updatedUser.isAdmin,
    country: updatedUser.country,
    image: updatedUser.image,
    likedPosts: updatedUser.likedPosts,
    followers: updatedUser.followers,
    following: updatedUser.following,
    wins: updatedUser.wins,
    loses: updatedUser.loses,
    draws: updatedUser.draws,
    isCreator: updatedUser.isCreator,
    currentLeague: updatedUser.currentLeague,
    initialCountFollowers: updatedUser.initialCountFollowers,
    verified: updatedUser.verified,
    blocked: updatedUser.blocked,
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Change a user to be creator
// @route   PUT /api/users/create
// @access  Private
const makeUserCreator = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  user.isCreator = true;
  await user.save();
  return res.status(201).json({ message: 'You are a creator Now' });
});
// @desc    Assign a league to the user
// @route   PUT /api/users/:id/league
// @access  Private/Admin
const assignLeagueToUser = asyncHandler(async (req, res) => {
  const { league } = req.body;
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: `Invalid user Id` });
  }
  const [user, existingLeague] = await Promise.all([
    User.findById(id),
    League.findById(league),
  ]);

  if (user.isCreator == false) user.isCreator = true;
  const creatorExists = existingLeague.creators.find(
    (creator) => creator.user.toString() === id
  );

  if (!creatorExists) {
    existingLeague.creators.push({
      user: id,
      wins: 0,
      losses: 0,
      draws: 0,
      numberOfGames: 0,
    });
  }
  user.currentLeague = league;
  await Promise.all([user.save(), existingLeague.save()]);
  return res.status(201).json({ message: 'You are a creator Now' });
});

// @desc    follow a user
// @route   PUT /api/users/follow/:userId
// @access  Private
const followUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const loggedInUserId = req.user.id;

  if (userId === loggedInUser) {
    return res
      .status(400)
      .json({ message: 'you cannot unfollow or follow your self' });
  }

  const userToFollow = await User.findById(userId);
  const loggedInUser = await User.findById(loggedInUserId);

  if (!userToFollow || !loggedInUser) {
    return res.status(404).send('User not found');
  }

  if (loggedInUser.following.includes(userId)) {
    return res.status(400).send('Already following this user');
  }

  loggedInUser.following.push(userId);
  userToFollow.followers.push(loggedInUserId);

  await loggedInUser.save();
  await userToFollow.save();

  return res.send('User followed successfully');
});

// @desc    follow a user
// @route   PUT /api/users/follow/:userId
// @access  Private
const unfollowUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const loggedInUserId = req.user.id;

  if (userId === loggedInUser) {
    return res
      .status(400)
      .json({ message: 'you cannot unfollow or follow your self' });
  }

  const userToUnfollow = await User.findById(userId);
  const loggedInUser = await User.findById(loggedInUserId);

  if (!userToUnfollow || !loggedInUser) {
    return res.status(404).send('User not found');
  }

  if (!loggedInUser.following.includes(userId)) {
    return res.status(400).send('Not following this user');
  }

  loggedInUser.following = loggedInUser.following.filter(
    (id) => id.toString() !== userId
  );
  userToUnfollow.followers = userToUnfollow.followers.filter(
    (id) => id.toString() !== loggedInUserId
  );

  await loggedInUser.save();
  await userToUnfollow.save();

  return res.send('User unfollowed successfully');
});

// @desc    Get a user's liked posts by ID
// @route   GET /api/users/:id/likedosts
// @access  Public
const getLikedPosts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    res.status(200).json(user.likedPosts);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

export {
  getUsers,
  login,
  register,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUserById,
  makeUserCreator,
  assignLeagueToUser,
  followUser,
  unfollowUser,
  getLikedPosts,
};
