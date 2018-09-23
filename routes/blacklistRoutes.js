const mongoose = require("mongoose");
const Blacklist = mongoose.model("emails");

module.exports = app => {
  app.post("/bounced-email", async (req, res) => {
    console.log(req.body);
    const blacklist = new Blacklist({
      email: req.body.email
    });
    try {
      await blacklist.save();
    } catch (err) {
      console.log("err:", err);
    }
  });
};
