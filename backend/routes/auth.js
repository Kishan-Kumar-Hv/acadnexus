import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/google', async (req, res) => {
  const { sub, email, name, picture, given_name } = req.body;
  
  if (!sub || !email) {
    return res.status(400).json({ error: 'Missing required user information' });
  }

  try {
    // Find or create user
    let user = await User.findOne({ googleId: sub });
    
    if (!user) {
      user = new User({
        googleId: sub,
        email,
        name,
        picture,
        given_name
      });
      await user.save();
    }

    res.json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error in Google auth:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Route to update dark mode preference
router.post('/preferences', async (req, res) => {
  const { userId, darkMode } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, { darkMode }, { new: true });
    res.json({ message: 'Preferences updated', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

export default router;
