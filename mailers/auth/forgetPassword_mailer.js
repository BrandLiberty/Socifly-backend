import { transporter, renderTemplate } from "../../config/nodemailer.js";

const forgetPasswordMailer = (user, otp) => {
  console.log("from signup mailer");

  let htmlString = renderTemplate({ user , otp}, "/auth/forgetPassword_mailer.ejs");

  const mailoption = {
    from: "taigorad10@gmail.com",
    to: user?.email,
    subject: "Socifly",
    html: htmlString,
  };
  transporter.sendMail(mailoption, function (err, info) {
    if (err) {
      console.log('ERROR : Unable to send email : ',err);
    } else {
      console.log("LOG :  Email Sent to "+ user.email);
    }
  });
};

export default forgetPasswordMailer;
