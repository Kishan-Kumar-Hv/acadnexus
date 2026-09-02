import User from '../models/User.js';
import { sendTaskOverdueEmail, sendMissedScheduleEmail, sendWeeklyReportEmail } from './emailService.js';

/**
 * Check for overdue tasks and send notifications
 */
export const checkOverdueTasks = async () => {
  try {
    const now = new Date();

    // Find users who have at least one pending task whose dueDate has passed and notification not yet sent
    const users = await User.find({
      'tasks': {
        $elemMatch: {
          status: 'pending',
          dueDate: { $lte: now },
          overdueEmailSent: { $ne: true }
        }
      }
    });

    for (const user of users) {
      let modified = false;

      for (const task of user.tasks) {
        if (task.status === 'pending' && task.dueDate && new Date(task.dueDate) <= now && !task.overdueEmailSent) {
          console.log(`[ALERT] Task "${task.title}" is overdue for user: ${user.email}`);
          await sendTaskOverdueEmail(user, task);
          task.overdueEmailSent = true;
          modified = true;
        }
      }

      if (modified) {
        await user.save();
      }
    }
  } catch (error) {
    console.error('[CRON ERROR] checkOverdueTasks:', error.message);
  }
};

/**
 * Check for weekly reports on Sunday
 */
export const checkWeeklyReports = async () => {
  try {
    const now = new Date();
    // Sunday is day 0
    if (now.getDay() !== 0) return;

    // Check users who haven't received weekly report in the past 6 days
    const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    const users = await User.find({
      $or: [
        { lastWeeklyReportSent: { $exists: false } },
        { lastWeeklyReportSent: null },
        { lastWeeklyReportSent: { $lt: sixDaysAgo } }
      ]
    });

    for (const user of users) {
      const completedTasksCount = user.tasks.filter(t => t.status === 'completed').length;
      const quizzesTaken = user.quizScores ? user.quizScores.length : 0;
      
      let avgScore = 85;
      if (user.quizScores && user.quizScores.length > 0) {
        const totalPct = user.quizScores.reduce((acc, q) => acc + (q.score / (q.total || 10)) * 100, 0);
        avgScore = Math.round(totalPct / user.quizScores.length);
      }

      await sendWeeklyReportEmail(user, {
        weekLabel: `Week of ${now.toLocaleDateString()}`,
        completedTasksCount,
        currentStreak: 12,
        quizzesTaken,
        avgScore
      });

      user.lastWeeklyReportSent = now;
      await user.save();
    }
  } catch (error) {
    console.error('[CRON ERROR] checkWeeklyReports:', error.message);
  }
};

/**
 * Initialize background interval
 */
export const startNotificationWorker = () => {
  console.log('[WORKER] AcadNexus Autonomous Notification Worker initialized.');

  // Run initial checks
  checkOverdueTasks();
  checkWeeklyReports();

  // Run every 60 seconds
  setInterval(() => {
    checkOverdueTasks();
  }, 60 * 1000);

  // Check weekly report every 6 hours
  setInterval(() => {
    checkWeeklyReports();
  }, 6 * 60 * 60 * 1000);
};
