import mongoose from 'mongoose';

const challengeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
    leagues: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'League',
        required: true,
      },
    ],
    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Season',
      required: true,
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'done'],
    },
  },
  {
    timestamps: true,
  }
);

const Challenge = mongoose.model('Challenge', challengeSchema);

export default Challenge;
