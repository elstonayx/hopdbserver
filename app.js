const mongoose = require("mongoose");
const cafeModel = require("./models/cafeModel.js");
const reviewModel = require("./models/reviewModel.js");

var findCafe = (req, res) => {
  console.log(req.query.name);
  cafeModel.Cafe.find(
    { name: { $regex: req.query.name, $options: "i" } },
    (err, data) => {
      if (err) return res.send(err);
      console.log(retrieveBloggerReview(data[0]["fsVenueId"]));
      res.send(data);
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

var retrieveBloggerReview = fsVenueId => {
  reviewModel.BloggerReview.find({ fsVenueId: fsVenueId }, (err, data) => {
    if (err) return console.log(err);
    //to be fixed: how to return the data out after finding
    return data;
  });
};

exports.findCafe = findCafe;
exports.postCafe = postCafe;
exports.retrieveBloggerReview = retrieveBloggerReview;
exports.postBloggerReview = postBloggerReview;
