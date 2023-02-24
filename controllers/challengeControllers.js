import asyncHandler from 'express-async-handler';
import Challenge from '../models/Challenge.js';

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
  res.status(200).json(challenge);
};

// @desc    Create a new Challenge
// @route   POST /api/challenges
// @access  Private/admin
const createChallenge = async (req, res) => {
  const { theme, league, season } = req.body;

  const newChallenge = new Challenge({
    theme,
    league,
    season,
  });

  await newChallenge.save();
  res.status(201).json(newChallenge);
};

// @desc    Update a challenge by its id
// @route   PUT /api/challenges/:id
// @access  Private/admin
const updateChallengeById = async (req, res) => {
  const { id } = req.params;
  const { theme, league, season } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: `No challenge with id: ${id}` });
  }

  const existingChallenge = await Challenge.findById(id);

  if (!existingChallenge) {
    res.status(404).json({ message: `No challenge with id: ${id}` });
  }

  existingChallenge.league = league || existingChallenge.league;
  existingChallenge.theme = theme || existingChallenge.theme;
  existingChallenge.season = season || existingChallenge.season;

  await existingChallenge.save()

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

export { getAllChallenges, getChallengeById, createChallenge, deleteChallenge,updateChallengeById };
