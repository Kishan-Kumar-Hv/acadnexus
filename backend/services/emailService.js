import nodemailer from 'nodemailer';

// Configure SMTP Transporter (supports Gmail App Passwords, SendGrid, Mailgun, etc.)
const createTransporter = () => {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // TLS
    family: 4,     // Force IPv4 (fixes Render ENETUNREACH IPv6 issue)
    auth: { user, pass }
  });
};

/**
 * Dispatch an email with fallback console logging
 */
const sendMail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`\n======================================================`);
    console.log(`[EMAIL NOTIFICATION SIMULATED - EMAIL_USER/PASS NOT SET]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content Preview: ${html.substring(0, 140)}...`);
    console.log(`======================================================\n`);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"AcadNexus AI" <${process.env.EMAIL_USER || 'notifications@acadnexus.com'}>`,
      to,
      subject,
      html
    });
    console.log(`[EMAIL SENT SUCCESSFULLY] To: ${to} MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[EMAIL SEND FAILED] To: ${to} Error:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Overdue Mission Alert Email
 */
export const sendTaskOverdueEmail = async (user, task) => {
  if (!user?.email) return;

  const subject = `⚠️ Mission Overdue: "${task.title}" - AcadNexus`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #1e293b;">
      <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">AcadNexus AI</h1>
        <p style="margin: 6px 0 0 0; color: #e0e7ff; font-size: 14px; font-weight: 600;">Mission Deadline Alert</p>
      </div>

      <div style="padding: 32px 24px;">
        <p style="font-size: 16px; color: #cbd5e1; margin-top: 0;">Hey <strong>${user.name || 'Student'}</strong>,</p>
        <p style="font-size: 15px; color: #94a3b8; line-height: 1.6;">
          Your scheduled mission has passed its target deadline and is still marked as pending in your Mission Control:
        </p>

        <div style="background-color: #1e293b; border-left: 4px solid #ef4444; border-radius: 12px; padding: 18px; margin: 24px 0;">
          <h3 style="margin: 0 0 6px 0; font-size: 18px; color: #ffffff; font-weight: 800;">${task.title}</h3>
          <p style="margin: 0; font-size: 13px; color: #f87171; font-weight: 600;">
            Scheduled Deadline: ${task.dueTime || (task.dueDate ? new Date(task.dueDate).toLocaleString() : 'Past Target')}
          </p>
        </div>

        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
          Consistent completion builds compound mastery. Take a few minutes right now to knock this out and maintain your study streak!
        </p>

        <div style="text-align: center; margin: 32px 0 16px 0;">
          <a href="https://acadnexus-7xlt.vercel.app/" style="background: linear-gradient(135deg, #4f46e5, #6366f1); color: #ffffff; font-size: 15px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 12px; display: inline-block; box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);">
            Complete Mission in Dashboard →
          </a>
        </div>
      </div>

      <div style="background-color: #0b1120; padding: 18px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b;">
        AcadNexus Autonomous Academic Engine • Automated Reminder
      </div>
    </div>
  `;

  return sendMail({ to: user.email, subject, html });
};

/**
 * Missed Calendar Schedule Alert Email
 */
export const sendMissedScheduleEmail = async (user, schedulePlan) => {
  if (!user?.email) return;

  const subject = `📅 Schedule Notice: You missed today's study milestone - AcadNexus`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #1e293b;">
      <div style="background: linear-gradient(135deg, #0284c7, #2563eb); padding: 32px 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 26px; font-weight: 900;">AcadNexus Smart Calendar</h1>
        <p style="margin: 6px 0 0 0; color: #bae6fd; font-size: 14px; font-weight: 600;">Adaptive Schedule Notification</p>
      </div>

      <div style="padding: 32px 24px;">
        <p style="font-size: 16px; color: #cbd5e1; margin-top: 0;">Hello <strong>${user.name || 'Student'}</strong>,</p>
        <p style="font-size: 15px; color: #94a3b8; line-height: 1.6;">
          Our engine noticed you missed your scheduled revision session for <strong>${schedulePlan.examName || 'Your Target Exam'}</strong>.
        </p>

        <div style="background-color: #1e293b; border-left: 4px solid #38bdf8; border-radius: 12px; padding: 18px; margin: 24px 0;">
          <h4 style="margin: 0 0 4px 0; font-size: 16px; color: #ffffff;">Milestone Focus:</h4>
          <p style="margin: 0; font-size: 14px; color: #38bdf8; font-weight: 600;">${schedulePlan.focusTitle || 'Core Revision & Practice'}</p>
        </div>

        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
          Don't worry about falling behind — AcadNexus can automatically redistribute your missed topics across remaining days with one click.
        </p>

        <div style="text-align: center; margin: 32px 0 16px 0;">
          <a href="https://acadnexus-7xlt.vercel.app/" style="background: linear-gradient(135deg, #0284c7, #2563eb); color: #ffffff; font-size: 15px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 12px; display: inline-block;">
            Open Adaptive Calendar →
          </a>
        </div>
      </div>

      <div style="background-color: #0b1120; padding: 18px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b;">
        AcadNexus AI • Empowering Your Future
      </div>
    </div>
  `;

  return sendMail({ to: user.email, subject, html });
};

/**
 * Assessment / Quiz Score Report Email
 */
export const sendScoreReportEmail = async (user, assessmentData) => {
  if (!user?.email) return;

  const percentage = Math.round((assessmentData.score / assessmentData.total) * 100);
  const subject = `🏆 Official Score Report: ${assessmentData.category} (${percentage}%) - AcadNexus`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #1e293b;">
      <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 36px 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 900;">AcadNexus Assessment Certificate</h1>
        <p style="margin: 6px 0 0 0; color: #d1fae5; font-size: 14px; font-weight: 600;">Verified Performance Report</p>
      </div>

      <div style="padding: 32px 24px;">
        <p style="font-size: 16px; color: #cbd5e1; margin-top: 0;">Congratulations <strong>${user.name || 'Student'}</strong>!</p>
        <p style="font-size: 15px; color: #94a3b8; line-height: 1.6;">
          You have successfully completed the <strong>${assessmentData.category}</strong> evaluation on AcadNexus.
        </p>

        <!-- Scorecard -->
        <div style="background: #1e293b; border-radius: 16px; padding: 24px; text-align: center; margin: 28px 0; border: 1px solid #334155;">
          <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px;">Calculated Proficiency</span>
          <div style="font-size: 54px; font-weight: 900; color: #34d399; margin: 8px 0;">${percentage}%</div>
          <p style="margin: 0; font-size: 15px; color: #e2e8f0; font-weight: 700;">
            Scored ${assessmentData.score} out of ${assessmentData.total} questions correctly
          </p>
        </div>

        <div style="background-color: #1e293b; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #34d399; text-transform: uppercase; letter-spacing: 0.5px;">Cognitive Feedback</h4>
          <p style="margin: 0; font-size: 14px; color: #cbd5e1; line-height: 1.6;">
            ${percentage >= 80 
              ? 'Outstanding grasp of underlying concepts! Your problem-solving velocity is within the top percentile.' 
              : percentage >= 50 
              ? 'Good working understanding. Focus on active flashcard recall on missed topics to cement exam readiness.' 
              : 'Foundational review recommended. Generate a tailored study plan in AcadNexus to target weak areas.'}
          </p>
        </div>

        <div style="text-align: center; margin: 32px 0 16px 0;">
          <a href="https://acadnexus-7xlt.vercel.app/" style="background: linear-gradient(135deg, #059669, #10b981); color: #ffffff; font-size: 15px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 12px; display: inline-block;">
            View Detailed Career & Skill Analysis →
          </a>
        </div>
      </div>

      <div style="background-color: #0b1120; padding: 18px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b;">
        Verified by AcadNexus AI Intelligence Engine • Official Student Record
      </div>
    </div>
  `;

  return sendMail({ to: user.email, subject, html });
};

/**
 * Weekly Performance Digest Email
 */
export const sendWeeklyReportEmail = async (user, stats) => {
  if (!user?.email) return;

  const subject = `📊 Your AcadNexus Weekly Academic Digest (${stats.weekLabel || 'This Week'})`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #1e293b;">
      <div style="background: linear-gradient(135deg, #d97706, #f59e0b); padding: 36px 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 900;">AcadNexus Weekly Digest</h1>
        <p style="margin: 6px 0 0 0; color: #fef3c7; font-size: 14px; font-weight: 600;">Your Weekly Academic Momentum</p>
      </div>

      <div style="padding: 32px 24px;">
        <p style="font-size: 16px; color: #cbd5e1; margin-top: 0;">Hey <strong>${user.name || 'Student'}</strong>,</p>
        <p style="font-size: 15px; color: #94a3b8; line-height: 1.6;">
          Here is your high-level overview of everything you accomplished over the past 7 days on AcadNexus:
        </p>

        <!-- Stats Grid -->
        <table style="width: 100%; border-collapse: separate; border-spacing: 12px; margin: 16px 0;">
          <tr>
            <td style="background-color: #1e293b; padding: 18px; border-radius: 12px; text-align: center; border: 1px solid #334155;">
              <span style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Missions Completed</span>
              <div style="font-size: 32px; font-weight: 900; color: #38bdf8; margin-top: 4px;">${stats.completedTasksCount || 0}</div>
            </td>
            <td style="background-color: #1e293b; padding: 18px; border-radius: 12px; text-align: center; border: 1px solid #334155;">
              <span style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Active Streak</span>
              <div style="font-size: 32px; font-weight: 900; color: #f59e0b; margin-top: 4px;">${stats.currentStreak || 7} Days</div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #1e293b; padding: 18px; border-radius: 12px; text-align: center; border: 1px solid #334155;">
              <span style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Quizzes / Tests Taken</span>
              <div style="font-size: 32px; font-weight: 900; color: #34d399; margin-top: 4px;">${stats.quizzesTaken || 0}</div>
            </td>
            <td style="background-color: #1e293b; padding: 18px; border-radius: 12px; text-align: center; border: 1px solid #334155;">
              <span style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Avg Performance</span>
              <div style="font-size: 32px; font-weight: 900; color: #a855f7; margin-top: 4px;">${stats.avgScore || 85}%</div>
            </td>
          </tr>
        </table>

        <div style="background-color: #1e293b; border-radius: 12px; padding: 18px; margin: 24px 0;">
          <h4 style="margin: 0 0 6px 0; font-size: 15px; color: #fbbf24;">⚡ Recommendation for Next Week</h4>
          <p style="margin: 0; font-size: 13px; color: #cbd5e1; line-height: 1.5;">
            Keep up the strong momentum! Make sure to set your study schedule at the start of the week to stay proactive.
          </p>
        </div>

        <div style="text-align: center; margin: 32px 0 16px 0;">
          <a href="https://acadnexus-7xlt.vercel.app/" style="background: linear-gradient(135deg, #d97706, #f59e0b); color: #ffffff; font-size: 15px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 12px; display: inline-block;">
            Open AcadNexus Dashboard →
          </a>
        </div>
      </div>

      <div style="background-color: #0b1120; padding: 18px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b;">
        AcadNexus Weekly Digest • Sent automatically every Sunday
      </div>
    </div>
  `;

  return sendMail({ to: user.email, subject, html });
};
