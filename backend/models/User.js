import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  given_name: String,
  picture: String,
  // User preferences
  darkMode: {
    type: Boolean,
    default: false
  },
  // Store generated data
  quizScores: [{
    category: String,
    score: Number,
    total: Number,
    date: { type: Date, default: Date.now }
  }],
  savedPlans: {
    type: Array,
    default: []
  },
  tasks: [{
    title: String,
    type: { type: String }, // e.g. 'Assignment', 'Revision'
    time: String,
    urgency: String,
    bgTheme: String,
    accent: String,
    progress: Number,
    status: { type: String, default: 'pending' },
    iconName: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
