const sendgrid = require("sendgrid");
const helper = sendgrid.mail;
const keys = require("../config/keys");
const { SENDGRID, AWS_EMAIL } = require("./types");
class Mailer extends helper.Mail {
  constructor(email, thirdParty) {
    super();
    this.strThirdParty = thirdParty;
    this.isSendGrid = thirdParty === "sendgrid";
    this.emailApi = this.thirdPartyKey();
    this.from_email = this.emailFrom(email.from);
    this.subject = email.subject;
    this.body = this.formatBody(email.body_html);
    this.recipients = this.formatAddresses(email.to);
    if (thirdParty === SENDGRID) {
      this.addContent(this.body);
      this.addRecipients();
    }
  }
  formatBody(contents) {
    switch (this.strThirdParty) {
      case SENDGRID:
        return new helper.Content("text/html", contents);
      case AWS_EMAIL:
        return;
      default:
        return;
    }
  }
  emailFrom(from) {
    switch (this.strThirdParty) {
      case SENDGRID:
        return new helper.Email(from);
      // return new helper.Email("no-reply@emaily.com");
      case AWS_EMAIL:
        return;
      default:
        return;
    }
  }
  thirdPartyKey() {
    switch (this.strThirdParty) {
      case SENDGRID:
        return sendgrid(keys.sendGridKey);
      case AWS_EMAIL:
        return;
      default:
        return;
    }
  }
  formatAddresses(recipients) {
    switch (this.strThirdParty) {
      case SENDGRID:
        return recipients.map(({ email }) => {
          return new helper.Email(email);
        });
      case AWS_EMAIL:
        return;
      default:
        return;
    }
  }
  addRecipients() {
    const personalize = new helper.Personalization();
    this.recipients.forEach(recipient => {
      personalize.addTo(recipient);
    });
    this.addPersonalization(personalize);
  }
  async send() {
    const request = this.emailApi.emptyRequest({
      method: "POST",
      path: "/v3/mail/send",
      body: this.toJSON()
    });
    const response = this.emailApi.API(request);
    return response;
  }
}
module.exports = Mailer;
