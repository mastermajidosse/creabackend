import mongoose from 'mongoose';

const challengeSchema = mongoose.Schema(
  {
    theme: {
      type: String,
      required: true,
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
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

const Challenge = mongoose.model('Challenge', challengeSchema);

export default Challenge;
