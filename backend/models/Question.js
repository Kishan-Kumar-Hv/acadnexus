import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    default: 'Anonymous Peer'
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  upvotes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    default: 'General'
  },
  authorName: {
    type: String,
    default: 'Anonymous Peer'
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  upvotes: {
    type: Number,
    default: 0
  },
  answers: [answerSchema]
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);
