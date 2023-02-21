import asyncHandler from 'express-async-handler';
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

export {
  getUsers,
  login,
  register,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUserById
};
