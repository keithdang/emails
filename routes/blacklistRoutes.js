const mongoose = require("mongoose");
const Blacklist = mongoose.model("emails");

module.exports = app => {
  app.post("/bounce/add", async (req, res) => {
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
  app.get("/bounce/check", async (req, res) => {
    // return new Promise((resolve,reject)=>{
    //     const blacklist = await Blacklist.find({
    //         email: "keitha.dang11@gmail.com"
    //       });
    //       if (blacklist && blacklist.length>0) {
    //           console.log("Hello");
    //         resolve();
    //       } else{
    //           reject();
    //       }
    // })
    const blacklist = await Blacklist.find({
      email: "keitha.dang11@gmail.com"
    });
    console.log(blacklist);
    if (blacklist && blacklist.length > 0) {
      console.log("hello");
    }
    //res.send(blacklist);
  });
};
