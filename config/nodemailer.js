import nodemailer from "nodemailer";
import ejs from "ejs";
import path  from "path";
const __dirname = path.resolve(path.dirname(''));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
<<<<<<< HEAD
    user: "contactsocifly@gmail.com",
    pass: "huklryrmifmagnnk",
=======
    user: "app.brandliberty@gmail.com",
    pass: "mhcfefhryrwpxzxg",
>>>>>>> 1eff7948cbc697458d4369b8dcce30b68bccd105
  },
});

let renderTemplate = (data, relativePath) => {
  let mailHTML;
  ejs.renderFile(
    path.join(__dirname, "/views/mailer", relativePath),
    data,
    function (err, template) {
      if (err) {
        console.log("Error in rendering template", err);
        return;
      }
      mailHTML = template;
    }
  );
  return mailHTML;
};

export { transporter, renderTemplate };
