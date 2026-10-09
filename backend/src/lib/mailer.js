const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || '"Admin Rapat" <your-email@gmail.com>',
    to,
    subject,
    html,
  };
  return await transporter.sendMail(mailOptions);
};

module.exports = {
  sendMail
};
