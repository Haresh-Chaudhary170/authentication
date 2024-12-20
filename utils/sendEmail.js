const nodemailer = require("nodemailer");
require('dotenv')

const sendEmail = async (options) => {
  var transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const message = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}> `,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.message,
  };
  await transporter.sendMail(message);

};

module.exports = sendEmail;
