import mongoose from 'mongoose';

const seasonSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const Season = mongoose.model('Season', seasonSchema);

export default Season;
