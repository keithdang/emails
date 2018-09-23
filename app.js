const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const keys = require("./config/keys");
const expressValidator = require("express-validator");

require("./models/Blacklist");
mongoose.connect(keys.mongoURI);
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.use(function(req, res, next) {
  res.locals.errors = null;
  next();
});
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;
      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

require("./routes/emailRoutes")(app);
require("./routes/blacklistRoutes")(app);

app.listen(3000);
