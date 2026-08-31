import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('AcadNexus API is running...');
});

import authRoutes from './routes/auth.js';
import tasksRoutes from './routes/tasks.js';
import communityRoutes from './routes/community.js';
import plansRoutes from './routes/plans.js';
import assessmentsRoutes from './routes/assessments.js';

app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/assessments', assessmentsRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Successfully!');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    console.warn('Running server in resilient mode for API & Auth services.');
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
