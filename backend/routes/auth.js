import express from 'express';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = new User({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        given_name: payload.given_name,
        picture: payload.picture,
      });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '7d' }
    );

    res.json({ token, user });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// Dedicated Default Student Login Route
router.get('/default-user', async (req, res) => {
  const fallbackUser = {
    _id: '67c29e10f111223344556677',
    googleId: 'default-student-user-1001',
    email: 'kishan@acadnexus.com',
    name: 'Kishan Kumar',
    given_name: 'Kishan',
    picture: 'https://ui-avatars.com/api/?name=Kishan+Kumar&background=4F46E5&color=fff',
    academicStage: 'Completed 12th Grade',
    targetMajor: 'Computer Science & AI',
    bio: 'Student at AcadNexus',
    countryCode: '+91',
    phoneNumber: '9876543210'
  };

  try {
    let user = await User.findOne({ email: 'kishan@acadnexus.com' });
    if (!user) {
      user = new User(fallbackUser);
      await user.save();
    }
    res.json(user);
  } catch (error) {
    console.warn('Using default user fallback:', error.message);
    res.json(fallbackUser);
  }
});

router.post('/demo', async (req, res) => {
  try {
    let user = await User.findOne({ email: 'kishan@acadnexus.com' });
    
    if (!user) {
      user = new User({
        googleId: 'default-student-user-1001',
        email: 'kishan@acadnexus.com',
        name: 'Kishan Kumar',
        given_name: 'Kishan',
        picture: 'https://ui-avatars.com/api/?name=Kishan+Kumar&background=4F46E5&color=fff',
        academicStage: 'Completed 12th Grade',
        targetMajor: 'Computer Science & AI',
        bio: 'Student at AcadNexus',
        countryCode: '+91',
        phoneNumber: '9876543210'
      });
      await user.save();
    }

    res.json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error in auth:', error);
    res.status(500).json({ error: 'Login failed' });
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

// Route to get full profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

// Route to update full profile
router.put('/profile/:userId', async (req, res) => {
  const { name, countryCode, phoneNumber, academicStage, targetMajor, bio, darkMode } = req.body;
  try {
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (countryCode !== undefined) updateData.countryCode = countryCode;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (academicStage !== undefined) updateData.academicStage = academicStage;
    if (targetMajor !== undefined) updateData.targetMajor = targetMajor;
    if (bio !== undefined) updateData.bio = bio;
    if (darkMode !== undefined) updateData.darkMode = darkMode;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateData },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
