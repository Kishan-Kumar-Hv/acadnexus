import express from 'express';
import User from '../models/User.js';
import { sendScoreReportEmail } from '../services/emailService.js';

const router = express.Router();

// Save assessment / quiz score
router.post('/score/:userId', async (req, res) => {
  const { category, score, total, details } = req.body;
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newScore = {
      category: category || 'General Quiz',
      score: score || 0,
      total: total || 10,
      details: details || null,
      date: new Date()
    };

    user.quizScores.unshift(newScore);
    await user.save();

    // Automatically send verified score report email
    sendScoreReportEmail(user, newScore).catch(err => 
      console.error('[EMAIL ERROR] sendScoreReportEmail:', err.message)
    );

    res.json({ message: 'Score saved successfully and report emailed', quizScores: user.quizScores });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Failed to save quiz score' });
  }
});

// Get user assessment history
router.get('/scores/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.quizScores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quiz scores' });
  }
});

export default router;
