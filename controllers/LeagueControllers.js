import asyncHandler from 'express-async-handler';
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
  console.log(existingLeague);
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
// @desc    Fetch all leagues
// @route   GET /api/leagues
// @access  Public
const getLeagueById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: `No challenge with id: ${id}` });
  }
  const league = await League.findById(id);
  if (!league) {
    res.status(404).json({ message: `No challenge with id: ${id}` });
  }
  res.status(200).json(league);
});

export { getLeagues, createLeague,getLeagueById };
