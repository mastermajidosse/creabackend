import mongoose from 'mongoose';

const leagueSChema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    creators: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        draws: { type: Number, default: 0 },
        numberOfGames: { type: Number, default: 0 },
      },
    ],
    challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],
    nextLeague: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'League',
      default: null,
    },
    prevLeague: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'League',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const League = mongoose.model('League', leagueSChema);

export default League;

//need to modify this model
//creators: [user,wins,loses,draws]
