const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

function validateEmails(emails) {
  const invalidEmails = emails
    .split(",")
    .map(email => email.trim())
    .filter(email => !re.test(email));
  if (invalidEmails.length) {
    return [{ msg: `These emails are invalid: ${invalidEmails}` }];
  }
  return;
}
function checkErrors(req) {
  req.checkBody("to", "To is required").notEmpty();
  req.checkBody("from", "From is required").notEmpty();
  req.checkBody("body_text", "Body is required").notEmpty();
  var toFrom = "";
  if (req.body.from.length > 0) {
    toFrom += req.body.from + ",";
  }
  if (req.body.to.length > 0) {
    toFrom += req.body.to;
  }
  var errors;
  if (toFrom.length > 0) {
    errors = validateEmails(toFrom);
  }
  if (!errors) {
    errors = req.validationErrors();
  }
  return errors;
}
module.exports = {
  validateEmails: validateEmails,
  checkErrors: checkErrors
};
