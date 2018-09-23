const mongoose = require("mongoose");
const { Schema } = mongoose; //destructuring equivalent to: const Schema = mongoose.Schema;
const RecipientSchema = require("./Recipients");
const surveySchema = new Schema({
  from: String,
  to: [RecipientSchema],
  //to: [{ email: String }],
  body_text: String,
  body_html: String
});
mongoose.model("surveys", surveySchema);
