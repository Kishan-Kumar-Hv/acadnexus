import express from 'express';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  const { credential, sub, email, name, picture, given_name } = req.body;
  
  let googleSub = sub;
  let userEmail = email;
  let userName = name;
  let userPicture = picture;
  let userGivenName = given_name;

  // Optional: If ID token credential was sent, verify token with Google
  if (credential && process.env.GOOGLE_CLIENT_ID) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      googleSub = payload.sub;
      userEmail = payload.email;
      userName = payload.name;
      userPicture = payload.picture;
      userGivenName = payload.given_name;
    } catch (verifyErr) {
      console.warn('Google ID Token verification warning:', verifyErr.message);
    }
  }

  if (!userEmail) {
    return res.status(400).json({ error: 'Missing required user information' });
  }

  const finalGoogleSub = googleSub || 'google-user-' + Date.now();

  try {
    let user = null;
    try {
      user = await User.findOne({ $or: [{ googleId: finalGoogleSub }, { email: userEmail.toLowerCase() }] });
    } catch (dbErr) {
      console.warn('MongoDB query warning:', dbErr.message);
    }
    
    if (!user) {
      const userData = {
        googleId: finalGoogleSub,
        email: userEmail.toLowerCase(),
        name: userName || 'Student User',
        picture: userPicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'Student')}&background=0D8ABC&color=fff`,
        given_name: userGivenName || userName?.split(' ')[0] || 'Student',
        academicStage: 'Completed 12th Grade',
        targetMajor: 'Computer Science & AI'
      };
      try {
        const newUser = new User(userData);
        user = await newUser.save();
      } catch (saveErr) {
        user = { _id: 'usr-' + Date.now(), ...userData };
      }
    } else {
      let updated = false;
      if (!user.googleId) { user.googleId = finalGoogleSub; updated = true; }
      if (userPicture && user.picture !== userPicture) { user.picture = userPicture; updated = true; }
      if (userName && user.name !== userName) { user.name = userName; updated = true; }
      if (updated) {
        try { await user.save(); } catch (e) {}
      }
    }

    res.json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error in Google auth:', error);
    res.json({
      message: 'Login successful',
      user: {
        _id: 'usr-' + Date.now(),
        googleId: finalGoogleSub,
        email: userEmail.toLowerCase(),
        name: userName || 'Student User',
        picture: userPicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'Student')}&background=0D8ABC&color=fff`,
        given_name: userGivenName || userName?.split(' ')[0] || 'Student',
        academicStage: 'Completed 12th Grade',
        targetMajor: 'Computer Science & AI'
      }
    });
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
