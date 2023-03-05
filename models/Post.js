import mongoose from 'mongoose';

const commentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

const postSchema = mongoose.Schema(
  {
    creator1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    creator2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    video1: {
      type: String,
      default: '',
    },
    thumbnail1: {
      type: String,
      default: '',
    },
    thumbnail2: {
      type: String,
      default: '',
    },
    video2: {
      type: String,
      default: '',
    },
    league: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'League',
      default: null,
    },
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      default: null,
    },
    status: {
      type: String,
      enum: ['waiting', 'done'],
      default: 'waiting',
    },
    votes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        winner: { type: Number, enum: [1, 2] }, // 1 for video1, 2 for video2
      },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likeCount: {
      type: Number,
      default: 0,
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
