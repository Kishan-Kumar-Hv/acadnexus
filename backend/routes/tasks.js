import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Helper to find user by ObjectId or googleId
const findUser = async (id) => {
  if (!id) return null;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    const user = await User.findById(id);
    if (user) return user;
  }
  return await User.findOne({ $or: [{ googleId: id }, { email: id }] });
};

// Get tasks
router.get('/:userId', async (req, res) => {
  try {
    const user = await findUser(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.tasks || []);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a task
router.post('/:userId', async (req, res) => {
  try {
    const user = await findUser(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.tasks.push(req.body);
    await user.save();
    
    // Return the newly added task (last one)
    res.json(user.tasks[user.tasks.length - 1]);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Server error adding task' });
  }
});

// Toggle task status
router.put('/:userId/:taskId', async (req, res) => {
  try {
    const user = await findUser(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const task = user.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.status = task.status === 'pending' ? 'completed' : 'pending';
    task.progress = task.status === 'completed' ? 100 : 0;
    
    await user.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a task
router.delete('/:userId/:taskId', async (req, res) => {
  try {
    const user = await findUser(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.tasks.pull({ _id: req.params.taskId });
    await user.save();
    
    res.json({ message: 'Task deleted successfully', taskId: req.params.taskId });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Server error deleting task' });
  }
});

export default router;
