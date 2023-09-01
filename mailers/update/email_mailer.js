import { transporter, renderTemplate } from "../../config/nodemailer.js";

const updatedEmailMailer = (user,hash) => {
  console.log("from signup mailer");

  try {
    let htmlString = renderTemplate({ user , hash}, "/update/email_mailer.ejs");
  
    const mailoption = {
      from: "taigorad10@gmail.com",
      to: user.updatedEmail,
      subject: "Socifly",
      html: htmlString,
    };
    transporter.sendMail(mailoption, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("email sent " + user.updatedEmail + info.response);
      }
    });
  } catch (error) {
    console.log('ERROR : Error sending emailto update email info')
    return null
  }
};

export default updatedEmailMailer;