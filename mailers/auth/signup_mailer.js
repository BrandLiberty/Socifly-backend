import { transporter, renderTemplate } from "../../config/nodemailer.js";

const signMailer = (user, hash) => {
  console.log("from signup mailer");

  let htmlString = renderTemplate({ user , hash}, "/auth/signup_mailer.ejs");

  const mailoption = {
    from: "taigorad10@gmail.com",
    to: user?.email,
    subject: "Socifly",
    html: htmlString,
  };
  transporter.sendMail(mailoption, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("email sent " + user.email + info.response);
    }
  });
};

export default signMailer;
