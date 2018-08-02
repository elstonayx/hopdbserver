const userModel = require("./../models/userModel");
const bcrypt = require("bcrypt");
const response = require("./../helper/status").response;

//buggy, please debug
//1. check for empty body
//2. check for errors with email sending
var addUser = (req, res) => {
  //TODO: checks for password - can be done on both client or server side
  //console.log(req.body);
  //if (!req.body.length) res.json(response(400, "No data sent"));
  var newUserProfile = new userModel.User({
    userId: req.body.userId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
    accountType: req.body.accountType,
    contact: {
      email: req.body.contact.email,
      phone: req.body.contact.phone
    },
    accountCreatedOn: Date.now()
  });

  newUserProfile.save(err => {
    if (err) {
      console.log(err);
      if (err.errors["userId"].message == "10100")
        return res.json(response(401, "Please use a unique username."));
      else if (err.errors["contact.email"].message == "10101")
        return res.json(response(401, "Please use a unique email address."));
      //else return console.log(err);
    } else res.json(response(200, "New user successfully created!"));
  });
};

//figure out fix for this, validation parts
var modifyUser = (req, res) => {
  userModel.User.findOne({ userId: req.body.userId }, (err, currentUser) => {
    if (err) {
      console.log(err);
      res.json(response(400, "Unable to find user,"));
    } else {
      currentUser.set(req.body);
      currentUser.save({ validateBeforeSave: false }, err => {
        if (err) {
          console.log(err);
          res.json(response(400, "unable to save current cafe"));
        } else {
          res.json(response(200, "successful!"));
        }
      });
    }
  });
};

exports.addUser = addUser;
exports.modifyUser = modifyUser;
