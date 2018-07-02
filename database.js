const cafeModel = require("./models/cafeModel");
const reviewModel = require("./models/reviewModel");
const authModel = require("./models/authModel");
const foursquare = require("./helper/foursquare");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

var findCafe = (req, res) => {
  if (req.query.fsVenueId == null)
    return res.json({
      error: 400,
      message: "Foursquare Venue Id not found."
    });
  cafeModel.Cafe.findOne(
    { fsVenueId: req.query.fsVenueId },
    async (err, data) => {
      var cafeResults = data;
      if (err) return res.send(err);
      if (data == null) {
        //unable to find from database
        console.log("Pulled from Foursquare");
        cafeResults = await foursquare.findCafe(req.query.fsVenueId);
        cafeResults.save((err, data) => {
          console.log("Saved", cafeResults.name, "to database!");
          if (err) return console.log(err);
        });
      }
      const bloggerReviews = await retrieveBloggerReview(req.query.fsVenueId);
      res.send({ cafeData: cafeResults, bloggerReviews: bloggerReviews });
    }
  );
};

var postCafe = (req, res) => {
  var newCafe = new cafeModel.Cafe(req.query);
  newCafe.save((err, data) => {
    if (err) return console.log(err);
    res.send(data);
  });
};

var postBloggerReview = (req, res) => {
  var newBloggerReview = new reviewModel.BloggerReview(req.query);
  newBloggerReview.save((err, data) => {
    if (err) return console.log(err);
    res.send(data);
  });
};

var retrieveBloggerReview = async fsVenueId => {
  var query;
  await reviewModel.BloggerReview.find(
    { fsVenueId: fsVenueId },
    (err, data) => {
      if (err) return console.log(err);
      query = data;
    }
  );
  return query;
};

/* 
AUTHENTICATION PROCESSES
------------------------
TO BE SHIFTED TO NEW FILE
*/

var addAuth = (req, res) => {
  const hashedAuthKey = bcrypt.hashSync(req.body.authKey, 10);
  var newAuthProfile = new authModel.Auth({
    authName: req.body.authName,
    authKey: hashedAuthKey,
    admin: true
  });
  newAuthProfile.save((err, data) => {
    if (err) {
      if (err.code == 11000) return res.send("Please user a unique username");
      else return console.log(err);
    } else res.send("New Profile successful!");
  });
};

var getToken = (req, res) => {
  console.log(req.body);
  authModel.Auth.findOne({ authName: req.body.authName }, (err, auth) => {
    if (err) console.log(err);
    console.log(auth.authKey);
    if (!auth)
      res.json({
        success: false,
        message: "Authentication failed. User not found"
      });
    else {
      bcrypt.compare(req.body.authKey, auth.authKey, (err, compareResults) => {
        if (!compareResults) {
          res.json({
            success: false,
            message: "Authentication failed. Wrong password."
          });
        } else {
          const payload = {
            admin: auth.admin
          };
          var token = jwt.sign(payload, process.env.SECRET);
          res.json({
            success: true,
            message: "Enjoy your token!",
            token: token
          });
        }
      });
    }
  });
};

var verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          message: "Failed to authenticate token"
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

exports.findCafe = findCafe;
exports.postCafe = postCafe;
exports.postBloggerReview = postBloggerReview;
exports.addAuth = addAuth;
exports.getToken = getToken;
exports.verifyToken = verifyToken;
