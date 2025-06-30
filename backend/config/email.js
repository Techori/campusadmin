const nodemailer = require('nodemailer');

module.exports.emailTransport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASS
  }
});

// Optionally export the sender, if your application needs it from env
module.exports.emailSender = process.env.EMAIL_SENDER;