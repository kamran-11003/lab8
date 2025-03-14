const nodemailer = require('nodemailer');
const cron = require('node-cron');
const Event = require('../models/Event');
const User = require('../models/User');

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Check for upcoming events every minute
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const events = await Event.find({
      reminderTime: {
        $lte: now,
        $gte: new Date(now - 60000) // Events in the last minute
      }
    }).populate('user');

    for (const event of events) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: event.user.email,
        subject: `Reminder: ${event.title}`,
        text: `Don't forget about your event "${event.title}" scheduled for ${event.date}`
      };

      await transporter.sendMail(mailOptions);
    }
  } catch (err) {
    console.error('Reminder Error:', err);
  }
});

module.exports = transporter;