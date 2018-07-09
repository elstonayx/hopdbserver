const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("./../models/userModel");

var addUser = (req, res) => {
  //TODO: checks for password - can be done on both client or server side
  const hashedPassword = bcrypt.hashSync(req.body.userPassword, 10);
  var newUserProfile = new userModel.User({
    userName: req.body.userName,
    userPassword: hashedPassword,
    accountType: "Standard",
    contact: {
      email: req.body.email,
      phone: req.body.phone
    },
    accountCreatedOn: Date.now()
  });

  newUserProfile.save(err => {
    if (err) {
      if (err.code == 11000)
        return res.json({
          errcode: 400,
          success: false,
          message: "Please use a unique username."
        });
      else return console.log(err);
    } else
      res.json({
        success: true,
        message: "New user successfully created!"
      });
  });
};

var userLogin = (req, res) => {
  userModel.User.findOne({ userName: req.body.userName }, (err, data) => {
    if (err) console.log(err);
    if (data == null) {
      res.json({
        success: false,
        message: "Authentication failed. User not found."
      });
    } else {
      bcrypt.compare(
        req.body.userPassword,
        data.userPassword,
        (err, compareResults) => {
          if (err) return console.log(err);
          if (compareResults == false) {
            res.json({
              success: false,
              message: "Authentication failed. Wrong password."
            });
          } else {
            const payload = {
              isLoggedIn: true,
              LoggedInDate: Date.now()
            };
            var token = jwt.sign(payload, process.env.JWT_SECRET);
            res.json({
              success: true,
              message: "Authentication success!",
              token: String(token)
            });
          }
        }
      );
    }
  });
};

var noUserLogin = (req, res) => {
  //check for source
  const payload = {
    isLoggedIn: false,
    loggedInDate: Date.now()
  };
  var token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
  res.json({
    success: true,
    message: "No login. Token will expire in 24 hours. ",
    token: token
  });
};

var verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (token != null) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          message: "Failed to authenticate token."
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      message: "No token provided."
    });
  }
};

exports.addUser = addUser;
exports.userLogin = userLogin;
exports.verifyToken = verifyToken;
exports.noUserLogin = noUserLogin;
