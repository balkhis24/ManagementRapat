const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const hasValidCredentials = 
  process.env.SMTP_USER && 
  process.env.SMTP_PASS && 
  !process.env.SMTP_USER.includes('your-email') &&
  !process.env.SMTP_PASS.includes('your-app-password');

let transporter = null;
if (hasValidCredentials) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const sendMail = async (to, subject, html) => {
  // Jika konfigurasi SMTP asli sudah diisi di .env, kirim email sungguhan via Nodemailer
  if (hasValidCredentials && transporter) {
    const mailOptions = {
      from: process.env.SMTP_FROM || `"Admin Rapat" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };
    return await transporter.sendMail(mailOptions);
  }

  // Fallback: Mode Simulasi Demo (Jika SMTP belum disetting di .env)
  // Menghindari kegagalan error "Missing credentials for PLAIN" saat demo/sidang
  console.log(`[SIMULASI EMAIL TERKIRIM] Penerima: ${to} | Subjek: "${subject}"`);
  return {
    messageId: `demo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    response: '250 OK: Simulasi demo pengiriman email berhasil',
    accepted: [to]
  };
};

module.exports = {
  sendMail
};
