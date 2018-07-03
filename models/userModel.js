const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var userSchema = new Schema({
  userName: { type: String, required: true, unique: true },
  userPassword: { type: String, required: true },
  accountType: Number,
  contact: {
    email: String,
    phone: String
  },
  reviewCount: Number,
  reward: {
    points: Number
  },
  accountCreatedOn: Date,
  lastLoggedIn: Date
});

module.exports = {
  User: mongoose.model("users", userSchema)
};
