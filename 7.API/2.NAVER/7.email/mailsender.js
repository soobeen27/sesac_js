require('dotenv').config({ quiet: true });
const { subscribe } = require('diagnostics_channel');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Email Template</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <!-- 메인 카드 -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden;">
                    
                    <!-- 헤더 (로고/배너) -->
                    <tr>
                        <td align="center" style="background-color: #4F46E5; padding: 40px 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">SSAM-PPONG</h1>
                            <p style="color: #e0e7ff; margin: 10px 0 0; font-size: 16px;">Service Notification</p>
                        </td>
                    </tr>

                    <!-- 본문 내용 -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #333333; font-size: 24px; margin-top: 0;">안녕하세요! 👋</h2>
                            <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                                요청하신 <strong>쌈뽕한 이메일</strong>이 성공적으로 도착했습니다.<br>
                                이메일 템플릿은 HTML과 인라인 CSS로 작성되어야 깨지지 않습니다.
                            </p>
                            
                            <!-- 강조 박스 -->
                            <div style="background-color: #f9fafb; border-left: 4px solid #4F46E5; padding: 15px; margin: 20px 0; border-radius: 4px;">
                                <p style="color: #4b5563; margin: 0; font-size: 14px;">
                                    💡 <strong>Tip:</strong> 이 코드는 Gmail, Naver, Outlook 등 대부분의 클라이언트에서 잘 작동합니다.
                                </p>
                            </div>

                            <!-- CTA 버튼 -->
                            <div align="center" style="margin-top: 40px;">
                                <a href="https://your-service.com" style="background-color: #4F46E5; color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                                    서비스 바로가기 🚀
                                </a>
                            </div>
                        </td>
                    </tr>

                    <!-- 푸터 -->
                    <tr>
                        <td style="background-color: #fafafa; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
                            <p style="color: #999999; font-size: 12px; margin: 0;">
                                © 2024 SsamPpong Service. All rights reserved.<br>
                                서울특별시 강남구 쌈뽕동 123-45
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- 하단 링크 -->
                <p style="text-align: center; margin-top: 20px; color: #999999; font-size: 12px;">
                    본 메일은 발신 전용입니다. <a href="#" style="color: #999999; text-decoration: underline;">수신거부</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
`;

const mailOptions = {
  from: process.env.GMAIL,
  to: process.env.GMAIL,
  subject: '테스트 이메일',
  html: htmlContent,
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) console.error(err);
  else console.log('메일 전송 성공', info);
});
