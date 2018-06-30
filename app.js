const cafeModel = require("./models/cafeModel.js");
const reviewModel = require("./models/reviewModel.js");
const request = require("request");

var findCafe = (req, res) => {
  console.log(req.query.name);
  cafeModel.Cafe.find(
    { name: { $regex: req.query.name, $options: "i" } },
    (err, data) => {
      if (err) return res.send(err);
      retrieveBloggerReview(data[0]["fsVenueId"], data, res);
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

var retrieveBloggerReview = (fsVenueId, dataFromCafeModel, res) => {
  var query;
  reviewModel.BloggerReview.find({ fsVenueId: fsVenueId }, (err, data) => {
    if (err) return console.log(err);
    res.send({ cafeData: dataFromCafeModel, bloggerReviews: data });
  });
  return query;
};

exports.findCafe = findCafe;
exports.postCafe = postCafe;
exports.postBloggerReview = postBloggerReview;
