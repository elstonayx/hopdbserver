const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var userSchema = new Schema({
  userId: { type: String, required: true },
  firstName: String,
  lastName: String,
  password: { type: String, required: true },
  //profilePhoto: String,
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

userSchema.path("userId").validate(async value => {
  var result;
  await mongoose.model("users").count({ userId: value }, (err, count) => {
    if (err) console.log(err);
    result = count;
  });
  return !result;
}, "10100");

userSchema.path("contact.email").validate(async value => {
  var result;
  await mongoose
    .model("users")
    .count({ "contact.email": value }, (err, count) => {
      if (err) console.log(err);
      //console.log("current email count:", count);
      result = count;
    });
  return !result;
}, "10101");

module.exports = {
  User: mongoose.model("users", userSchema)
};
