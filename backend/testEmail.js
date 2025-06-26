const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
  from: process.env.EMAIL_SENDER,
  to: process.env.EMAIL_SENDER, // send to self for test
  subject: 'Test Email from Node.js Script',
  text: 'This is a test email sent directly from a Node.js script using your current credentials.'
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error('Error sending email:', err);
    process.exit(1);
  } else {
    console.log('Success! Email sent:', info.response);
    process.exit(0);
  }
}); 