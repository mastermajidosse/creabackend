import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import League from '../models/League.js';

// @desc    Fetch all leagues
// @route   GET /api/leagues
// @access  Public
const getLeagues = asyncHandler(async (req, res) => {
  const leagues = await League.find({});
  res.status(200).json(leagues);
});
// @desc    create a league
// @route   POST /api/league
// @access  Private
const createLeague = asyncHandler(async (req, res) => {
  const { nameLeague } = req.body;
  const existingLeague = await League.findOne({ name: nameLeague });
  if (existingLeague) {
    return res
      .status(401)
      .json({ message: 'Already existing League with this name' });
  }
  const league = new League({
    name: nameLeague,
  });
  await league.save();
  return res.status(201).json(league);
});
// @desc    Fetch a league by Id
// @route   POST /api/league/:id
// @access  Public
const getLeagueById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: `No League with id: ${id}` });
  }
  const league = await League.findById(id);
  if (!league) {
    res.status(404).json({ message: `No League with id: ${id}` });
  }
  res.status(200).json(league);
});
// @desc    Assign next and prev leagues for a league by Id
// @route   POST /api/league/:id/assign
// @access  Private/Admin
const assignLeagues = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nextLeague, prevLeague } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: `No League with id: ${id}` });
  }
  const league = await League.findById(id);
  if (!league) {
    res.status(404).json({ message: `No League with id: ${id}` });
  }
  league.nextLeague = nextLeague;
  league.prevLeague = prevLeague;
  await league.save();
  res.status(201).json({ message: 'Leagues assigned with success' });
});

export { getLeagues, createLeague, getLeagueById, assignLeagues };
