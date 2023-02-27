import asyncHandler from 'express-async-handler';
import Season from '../models/Season.js';

// @desc    Fetch all seasons
// @route   GET /api/season
// @access  Public
const getSeasons = asyncHandler(async (req, res) => {
  const seasons = await Season.find({});
  res.status(200).json(seasons);
});
// @desc    create a season
// @route   POST /api/season
// @access  Private
const createSeason = asyncHandler(async (req, res) => {
  const { name, startDate, endDate } = req.body;
  const existingSeason = await Season.findOne({ name });
  if (existingSeason) {
    return res
      .status(401)
      .json({ message: 'Already existing Season with this name' });
  }
  const startTimestamp = new Date(startDate).getTime();
  const endTimeStamp = new Date(endDate).getTime();
  const now = new Date();
  if (startTimestamp >= endTimeStamp || startTimestamp < now.getTime()) {
    return res.status(400).json({ message: 'Invalid Dates' });
  }
  const season = new Season({
    name,
    startDate,
    endDate,
  });
  await season.save();
  return res.status(201).json(season);
});
// @desc    Fetch a season by Id
// @route   POST /api/season/:id
// @access  Public
const getSeasonById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: `No Season with id: ${id}` });
  }
  const season = await Season.findById(id);
  if (!season) {
    res.status(404).json({ message: `No Season with id: ${id}` });
  }
  res.status(200).json(season);
});

export { getSeasons, createSeason, getSeasonById };
