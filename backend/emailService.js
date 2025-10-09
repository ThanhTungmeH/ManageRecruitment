
const nodemailer = require('nodemailer');
let transporter = null;
const initializeTransporter = async () => {
  if (!transporter) {
    try {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        }
      });
      
      // Test connection
      await transporter.verify();
      console.log('✅ Gmail SMTP connection successful');
    } catch (error) {
      console.error('❌ Gmail SMTP connection failed:', error);
      throw error;
    }
  }
  return transporter;
};

const emailTemplates = {
  applicationReceived: (candidateName, jobTitle) => ({
    subject: `Xác nhận nhận hồ sơ ứng tuyển - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Cảm ơn bạn đã ứng tuyển!</h2>
        <p>Chào <strong>${candidateName}</strong>,</p>
        <p>Chúng tôi đã nhận được hồ sơ ứng tuyển của bạn cho vị trí <strong>${jobTitle}</strong>.</p>
        <p>Chúng tôi sẽ xem xét và liên hệ với bạn trong vòng 3-5 ngày làm việc.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">
          Email này được gửi tự động. Vui lòng không reply.
        </p>
      </div>
    `
  }),

  interviewInvitation: (candidateName, jobTitle, interviewData) => ({
    subject: `Mời phỏng vấn - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Mời phỏng vấn</h2>
        <p>Chào <strong>${candidateName}</strong>,</p>
        <p>Chúng tôi rất vui mừng mời bạn tham gia phỏng vấn cho vị trí <strong>${jobTitle}</strong>.</p>
        
        <div style="background: #f0f9ff; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #0ea5e9;">
          <h3 style="margin-top: 0; color: #0c4a6e;">Thông tin phỏng vấn:</h3>
          <p><strong>📅 Thời gian:</strong> ${interviewData.date} lúc ${interviewData.time}</p>
          <p><strong>📍 Địa điểm:</strong> ${interviewData.location}</p>
          <p><strong>👤 Người phỏng vấn:</strong> ${interviewData.interviewer}</p>
          <p><strong>⏱️ Thời lượng:</strong> ${interviewData.duration} phút</p>
        </div>
        
        <p><strong>Vui lòng xác nhận tham gia bằng cách reply email này.</strong></p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">
          Nếu bạn cần thay đổi lịch phỏng vấn, vui lòng liên hệ ngay với chúng tôi.
        </p>
      </div>
    `
  }),

  applicationAccepted: (candidateName, jobTitle) => ({
    subject: `🎉 Chúc mừng! Bạn đã được tuyển dụng - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">🎉 Chúc mừng!</h2>
        <p>Chào <strong>${candidateName}</strong>,</p>
        <p>Chúng tôi rất vui mừng thông báo bạn đã được chọn cho vị trí <strong>${jobTitle}</strong>.</p>
        
        <div style="background: #f0fdf4; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #22c55e;">
          <p><strong>Bước tiếp theo:</strong></p>
          <ul>
            <li>Bộ phận HR sẽ liên hệ với bạn trong 24-48h tới</li>
            <li>Thảo luận chi tiết về hợp đồng và mức lương</li>
            <li>Xác định ngày bắt đầu làm việc</li>
          </ul>
        </div>
        
        <p>Chúng tôi rất mong được chào đón bạn gia nhập đội ngũ!</p>
      </div>
    `
  }),

  applicationRejected: (candidateName, jobTitle) => ({
    subject: `Cảm ơn bạn đã ứng tuyển - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Cảm ơn bạn đã quan tâm</h2>
        <p>Chào <strong>${candidateName}</strong>,</p>
        <p>Cảm ơn bạn đã dành thời gian ứng tuyển vào vị trí <strong>${jobTitle}</strong>.</p>
        
        <p>Sau khi xem xét kỹ lưỡng, chúng tôi quyết định chọn ứng viên khác phù hợp hơn với yêu cầu hiện tại.</p>
        
        <div style="background: #fef2f2; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ef4444;">
          <p><strong>Chúng tôi sẽ:</strong></p>
          <ul>
            <li>Lưu hồ sơ của bạn cho các cơ hội tương lai</li>
            <li>Ưu tiên xem xét nếu có vị trí phù hợp</li>
            <li>Thông báo qua email nếu có cơ hội mới</li>
          </ul>
        </div>
        
        <p>Chúc bạn thành công trong việc tìm kiếm cơ hội nghề nghiệp!</p>
      </div>
    `
  })
};

const sendEmail = async (to, template, data) => {
  try {
    const emailTransporter = await initializeTransporter();
    const emailContent = emailTemplates[template](data.candidateName, data.jobTitle, data);
    
    const info = await emailTransporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html
    });
    
    
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail, initializeTransporter };