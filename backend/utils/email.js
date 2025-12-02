const nodemailer = require("nodemailer");

async function sendEmail({ to, subject, html }) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    });

    console.log("📧 Email sent:", info.messageId);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) console.log("🔍 Preview URL:", previewUrl);

    return { previewUrl };
  } catch (error) {
    console.error("❌ Email error:", error);
    throw error;
  }
}

module.exports = sendEmail;
