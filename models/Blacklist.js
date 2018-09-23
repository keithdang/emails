const mongoose = require("mongoose");
const { Schema } = mongoose;
const addressSchema = new Schema({
  email: String
});
mongoose.model("emails", addressSchema);
