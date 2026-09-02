// Seed script for AcadNexus MongoDB Atlas
import 'dotenv/config';
import mongoose from 'mongoose';

// Define sample schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: { type: String, default: 'student' },
});
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'pending' },
});

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    // Clear existing data (optional)
    await User.deleteMany({});
    await Task.deleteMany({});

    // Create sample users
    const users = await User.insertMany([
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' },
    ]);
    console.log('Inserted users:', users.length);

    // Create sample tasks linked to users
    const tasks = await Task.insertMany([
      { title: 'Task 1', description: 'First task', assignedTo: users[0]._id },
      { title: 'Task 2', description: 'Second task', assignedTo: users[1]._id },
    ]);
    console.log('Inserted tasks:', tasks.length);

    console.log('Database seeding completed successfully');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
