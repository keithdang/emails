const mongoose = require("mongoose");
const Blacklist = mongoose.model("emails");
const Mailer = require("../services/Mailer");
const basicTemplate = require("../services/emailTemplates/basicTemplate");
const { SENDGRID, AWS_EMAIL } = require("../services/types");
const { validateEmails, checkErrors } = require("../services/validateEmails");

module.exports = app => {
  app.get("/", function(req, res) {
    res.render("index");
  });
  app.post("/send-email", async (req, res) => {
    const blacklist = await Blacklist.find({
      email: req.body.from
    });
    //console.log("blacklist:", blacklist);
    if (blacklist && blacklist.length === 0) {
      var errors = checkErrors(req);
      if (errors) {
        res.render("index", { errors: errors });
      } else {
        res.render("index", { errors: null });
        const email = {
          to: req.body.to.split(",").map(email => ({ email: email.trim() })),
          from: req.body.from,
          subject: req.body.subject,
          body_text: req.body.body_text,
          body_html: basicTemplate(req.body.body_text)
        };
        const mailer = new Mailer(email, SENDGRID);
        try {
          await mailer.send();
          console.log("success:", email);
        } catch (err) {
          res.status(422).send(err);
        }
      }
    } else {
      res.render("index", {
        errors: [{ msg: req.body.from + " has been banned" }]
      });
    }
  });
};
