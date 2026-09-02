import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(morgan('combined'));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Basic Route
app.get('/', (req, res) => {
  res.send('AcadNexus API is running...');
});

import { sendTaskOverdueEmail } from './services/emailService.js';
import { checkOverdueTasks } from './services/notificationWorker.js';

// Direct test endpoint to verify email delivery from Render
app.get('/api/test-email', async (req, res) => {
  const email = req.query.email || process.env.EMAIL_USER;
  try {
    const fakeUser = { name: 'Kishan Kumar', email };
    const fakeTask = { title: 'Immediate Test Task', dueTime: 'Just Now', dueDate: new Date() };
    const result = await sendTaskOverdueEmail(fakeUser, fakeTask);
    res.json({ status: 'ok', sentTo: email, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Direct trigger to run overdue tasks checker immediately
app.get('/api/check-overdue', async (req, res) => {
  try {
    await checkOverdueTasks();
    res.json({ status: 'checkOverdueTasks completed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

import { startNotificationWorker } from './services/notificationWorker.js';

// Database Connection
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB Successfully!');
    startNotificationWorker();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    console.warn('Running server in resilient mode for API & Auth services.');
    startNotificationWorker();
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
