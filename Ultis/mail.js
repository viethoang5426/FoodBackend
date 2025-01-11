const { model } = require("mongoose");
const nodemailer = require("nodemailer");

const sendEmail = async (mailOption) => {
  const tranposter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailDemo = {
    from: {
      name: "Yummy Store",
      address: "Your OTP",
    },
    to: mailOption.Email,
    subject: mailOption.subject,
    html: mailOption.html,
  };

  await tranposter.sendMail(mailDemo);
};

module.exports = sendEmail;
