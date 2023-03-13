import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Challenge from '../models/Challenge.js';
import League from '../models/League.js';
import User from '../models/User.js';

// @desc    Fetch all posts
// @route   GET /api/challenges
// @access  Public
const getAllChallenges = asyncHandler(async (req, res) => {
  const challenges = await Challenge.find();
  res.status(200).json(challenges);
});

// @desc    Fetch a post by id
// @route   GET /api/challenges/:id
// @access  Public
const getChallengeById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: `No challenge with id: ${id}` });
  }

  const challenge = await Challenge.findById(id);
  if (!challenge) {
    res.status(404).json({ message: `No challenge with id: ${id}` });
  }
  res.status(200).json(challenge);
};

// @desc    Create a new Challenge
// @route   POST /api/challenges
// @access  Private/admin
const createChallenge = async (req, res) => {
  const { name, theme, league, deadline } = req.body;

  const [existingLeague, existingChallenge] = await Promise.all(
    [
      League.findById(league),
      Challenge.findOne({ name }),
    ]
  );


  if (existingChallenge) {
    return res
      .status(401)
      .json({ message: 'Already existing Challenge with this name' });
  }
  if (deadline < new Date()) {
    return res.status(401).json({ message: 'Invalid Deadline' });
  }

  const newChallenge = new Challenge({
    name,
    theme,
    league,
    deadline,
  });
  existingLeague.challenges.push(newChallenge);

  const [savedChallenge, savedLeague] = await Promise.all([
    newChallenge.save(),
    existingLeague.save(),
  ]);
  res.status(201).json(savedChallenge);
};

// @desc    Update a challenge by its id
// @route   PUT /api/challenges/:id
// @access  Private/admin
const updateChallengeById = async (req, res) => {
  const { id } = req.params;
  const { name, theme, league } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: `No challenge with id: ${id}` });
  }

  const existingChallenge = await Challenge.findById(id);

  if (!existingChallenge) {
    res.status(404).json({ message: `No challenge with id: ${id}` });
  }

  existingChallenge.name = name || existingChallenge.name;
  existingChallenge.league = league || existingChallenge.league;
  existingChallenge.theme = theme || existingChallenge.theme;

  await existingChallenge.save();

  res.status(201).json(existingChallenge);
};

// @desc    Delete a challenge by its id
// @route   DELETE /api/challenges/:id
// @access  Private/admin
const deleteChallenge = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No challenge with id: ${id}`);
  }

  await Challenge.findByIdAndRemove(id);

  res.json({ message: 'Challenge deleted successfully' });
};

// @desc    Get Convinient Challenges for a user
// @route   GET /api/challenges/user
// @access  Private
const getChallengesForUser = asyncHandler(async(req,res) => {
  const userId = req.user.id
  const user = await User.findById(userId)
  if(!user) return res.status(404).json({message:"No user found with this Id"})

  const challenges = await Challenge.find({
    league: user.currentLeague,
    deadline: { $gt: new Date() },
  });

  res.status(200).json({challenges})

})

export {
  getAllChallenges,
  getChallengeById,
  createChallenge,
  deleteChallenge,
  updateChallengeById,
  getChallengesForUser
};
