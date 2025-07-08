const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your app-specific password
  }
});

const sendMail = async (email, subject, message) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Use EMAIL_USER instead of EMAIL
      to: email,
      subject: subject,
      text: message
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return { success: true, info }; // Return the success status and email info
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error }; // Return the error details
  }
};

module.exports = sendMail;
