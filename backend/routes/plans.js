import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Save a study plan
router.post('/study/:userId', async (req, res) => {
  const { planTitle, hours, plan } = req.body;
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newPlan = {
      id: Date.now(),
      title: planTitle || 'Study Plan',
      hours: hours || 3,
      plan: plan || [],
      createdAt: new Date()
    };

    user.savedPlans.unshift(newPlan);
    await user.save();
    res.json({ message: 'Study plan saved successfully', savedPlans: user.savedPlans });
  } catch (error) {
    console.error('Error saving study plan:', error);
    res.status(500).json({ error: 'Failed to save study plan' });
  }
});

// Get saved study plans
router.get('/study/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.savedPlans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch study plans' });
  }
});

// Save a calendar schedule
router.post('/calendar/:userId', async (req, res) => {
  const { examName, examDate, hoursPerDay, schedule } = req.body;
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newSchedule = {
      id: Date.now(),
      examName: examName || 'Target Exam',
      examDate,
      hoursPerDay,
      schedule: schedule || [],
      createdAt: new Date()
    };

    user.savedSchedules.unshift(newSchedule);
    await user.save();
    res.json({ message: 'Calendar schedule saved successfully', savedSchedules: user.savedSchedules });
  } catch (error) {
    console.error('Error saving calendar schedule:', error);
    res.status(500).json({ error: 'Failed to save calendar schedule' });
  }
});

// Get saved calendar schedules
router.get('/calendar/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.savedSchedules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch calendar schedules' });
  }
});

export default router;
