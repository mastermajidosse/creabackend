import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Challenge from '../models/Challenge.js';
import League from '../models/League.js';
import Season from '../models/Season.js';

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
  const { name, theme, league, season, deadline } = req.body;

  const [existingLeague, existingChallenge, existingSeason] = await Promise.all(
    [
      League.findById(league),
      Challenge.findOne({ name }),
      Season.findById(season),
    ]
  );

  if (!existingSeason) {
    return res.status(404).json({ message: 'No season with this id' });
  }

  if (existingSeason.endDate < new Date()) {
    return res.status(401).json({ message: 'The season is already expired' });
  }

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
    season,
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
  const { name, theme, league, season } = req.body;

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
  existingChallenge.season = season || existingChallenge.season;

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

export {
  getAllChallenges,
  getChallengeById,
  createChallenge,
  deleteChallenge,
  updateChallengeById,
};
