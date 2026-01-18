require('dotenv').config({ quiet: true });
const { subscribe } = require('diagnostics_channel');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'naver',
  host: 'smpt.naver.com',
  port: 465,
  auth: {
    user: process.env.NAVER_EMAIL,
    pass: process.env.NAVER_PASSWORD,
  },
});

const mailOptions = {
  from: process.env.NAVER_EMAIL,
  to: process.env.NAVER_EMAIL,
  subject: '테스트 이메일',
  text: 'ㅎㅇ',
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) console.error(err);
  else console.log('메일 전송 성공', info);
});
