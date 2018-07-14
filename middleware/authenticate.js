const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("./../models/userModel");
const response = require("./../helper/status").response;

var addUser = (req, res) => {
  //TODO: checks for password - can be done on both client or server side
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  var newUserProfile = new userModel.User({
    userId: req.body.userId,
    password: hashedPassword,
    accountType: req.body.accountType,
    contact: {
      email: req.body.contact.email,
      phone: req.body.contact.phone
    },
    accountCreatedOn: Date.now()
  });

  newUserProfile.save(err => {
    if (err) {
      if (err.code == 11000)
        return res.json(response(400, "Please use a unique username."));
      else return console.log(err);
    } else res.json(response(200, "New user successfully created!"));
  });
};

var userLogin = (req, res) => {
  userModel.User.findOne({ userId: req.body.userId }, (err, data) => {
    if (err) console.log(err);
    if (data == null) {
      res.json(response(400, "Authentication failed. User not found."));
    } else {
      bcrypt.compare(
        req.body.password,
        data.password,
        (err, compareResults) => {
          if (err) return console.log(err);
          if (compareResults == false) {
            res.json(response(400, "Authentication failed. Wrong password."));
          } else {
            const payload = {
              isLoggedIn: true,
              LoggedInDate: Date.now()
            };
            var token = jwt.sign(payload, process.env.JWT_SECRET);
            res.json({ success: true, statusCode: 200, token: String(token) });
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
  res.json({ success: true, statusCode: 200, token: String(token) });
};

var verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (token != null) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.json(response(400, "Failed to authenticate token."));
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else return res.json(response(403, "No token provided."));
};

exports.addUser = addUser;
exports.userLogin = userLogin;
exports.verifyToken = verifyToken;
exports.noUserLogin = noUserLogin;
