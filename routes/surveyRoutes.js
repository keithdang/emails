const mongoose = require("mongoose");
const Survey = mongoose.model("surveys");
const Blacklist = mongoose.model("emails");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");
const { SENDGRID, AWS_EMAIL } = require("../services/types");
module.exports = app => {
  // app.get("/api/surveys", async (req, res) => {
  //   const survey = await Survey.find(function(err, survey) {
  //     console.log("surveys:", survey);
  //     res.send(survey);
  //   });
  // });
  app.post("/surveys/add", async (req, res) => {
    const blacklist = await Blacklist.find({
      email: req.body.from
    });
    //console.log("blacklist:", blacklist);
    if (blacklist && blacklist.length === 0) {
      req.checkBody("to", "To is required").notEmpty();
      req.checkBody("from", "From is required").notEmpty();
      req.checkBody("body_text", "Body is required").notEmpty();
      var errors = req.validationErrors();
      if (errors) {
        res.render("index", {
          errors: errors
        });
      } else {
        var to = req.body.to;
        var from = req.body.from;
        var body_text = req.body.body_text;
        var body_html = "Hello";
        const survey = new Survey({
          to: to.split(",").map(email => ({ email: email.trim() })),
          from,
          body_text,
          body_html
        });
        const mailer = new Mailer(survey, surveyTemplate(survey), SENDGRID);
        mailer.send();
        console.log("success:", survey);
      }
    } else {
      res.render("index", {
        errors: [
          {
            msg: "That email has been banned"
          }
        ]
      });
    }
  });
};
