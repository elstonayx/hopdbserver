const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

var userSchema = new Schema({
  userId: { type: String, required: true },
  firstName: String,
  lastName: String,
  password: { type: String, required: true, set: hashPassword },
  //profilePhoto: String,
  accountType: Number,
  contact: {
    email: String,
    phone: String
  },
  reviewCount: { type: Number, default: 0 },
  reward: {
    points: Number
  },
  accountCreatedOn: Number,
  savedCafes: [String], //include name, fsVenueId, photos
  lastLoggedIn: Date
});

function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

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

//HI USER MODEL
//CAN I HAZ SAVE FAVOURITE CAFE FUNCTION
//THX
