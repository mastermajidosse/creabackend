import mongoose from 'mongoose';

const seasonSchema = mongoose.Schema(
  {
    theme: {
      type: String,
      required: true,
    },
    likesCount: {
      type: Number,
    },
    league: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'League',
      required: true,
    },
    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Season',
      required: true,
    },
    votes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        winner: { type: Number, enum: [1, 2] }, // 1 for video1, 2 for video2
      },
    ],
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

const Season = mongoose.model('Season', seasonSchema);

export default Season;
