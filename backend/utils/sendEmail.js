const nodeMailer = require("nodemailer");
 
const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
      // host: "smtp.gmail.com",
      // port:465,
      // service: process.env.SMTP_SERVICE,
      // auth: {
      //   user: process.env.SMTP_MAIL,
      //   pass: process.env.SMTP_PASSWORD,
      // },

      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "dab6531b473a2d",
        pass: "7b0af76ff0709d",
      },
    });
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;