import express from 'express';
import Question from '../models/Question.js';

const router = express.Router();

// Get all community questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Post a new question
router.post('/', async (req, res) => {
  const { title, description, domain, authorName, authorId } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  try {
    const question = new Question({
      title,
      description,
      domain: domain || 'General',
      authorName: authorName || 'Anonymous Peer',
      authorId: authorId || null
    });
    await question.save();
    res.json(question);
  } catch (error) {
    console.error('Error posting question:', error);
    res.status(500).json({ error: 'Failed to post question' });
  }
});

// Post an answer to a question
router.post('/:questionId/answer', async (req, res) => {
  const { text, authorName, authorId } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Answer text is required' });
  }

  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    question.answers.push({
      text,
      authorName: authorName || 'Anonymous Peer',
      authorId: authorId || null
    });

    await question.save();
    res.json(question);
  } catch (error) {
    console.error('Error adding answer:', error);
    res.status(500).json({ error: 'Failed to add answer' });
  }
});

// Upvote a question
router.put('/:questionId/upvote', async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.questionId,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upvote' });
  }
});

export default router;
