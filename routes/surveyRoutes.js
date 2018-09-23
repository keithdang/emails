const mongoose = require("mongoose");
const Survey = mongoose.model("surveys");
const Blacklist = mongoose.model("emails");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");
const { SENDGRID, AWS_EMAIL } = require("../services/types");
const { validateEmails, checkErrors } = require("../services/validateEmails");

module.exports = app => {
  app.post("/surveys/add", async (req, res) => {
    const blacklist = await Blacklist.find({
      email: req.body.from
    });
    //console.log("blacklist:", blacklist);
    if (blacklist && blacklist.length === 0) {
      req.checkBody("to", "To is required").notEmpty();
      req.checkBody("from", "From is required").notEmpty();
      req.checkBody("body_text", "Body is required").notEmpty();
      var errors = checkErrors(req);
      if (errors) {
        res.render("index", {
          errors: errors
        });
      } else {
        res.render("index", {
          errors: null
        });
        var to = req.body.to;
        var from = req.body.from;
        var body_text = req.body.body_text;
        var body_html = surveyTemplate(to, from, body_text);
        const survey = {
          to: to.split(",").map(email => ({ email: email.trim() })),
          from: from,
          body_text: body_text,
          body_html: body_html
        };
        const mailer = new Mailer(survey, SENDGRID);
        try {
          await mailer.send();
          console.log("success:", survey);
        } catch (err) {
          res.status(422).send(err);
        }
      }
    } else {
      res.render("index", {
        errors: [
          {
            msg: req.body.from + " has been banned"
          }
        ]
      });
    }
  });
};
