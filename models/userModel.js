const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var userSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  password: { type: String, required: true },
  profilePhoto: String,
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
