import asyncHandler from 'express-async-handler';
import League from '../models/League.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

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
  console.log(existingLeague)
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

export { getLeagues, createLeague };
