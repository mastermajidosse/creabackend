import mongoose from 'mongoose';

const leagueSChema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    creators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],
  },
  {
    timestamps: true,
  }
);

const League = mongoose.model('League', leagueSChema);

export default League;


//need to modify this model
//creators: [user,wins,loses,draws]