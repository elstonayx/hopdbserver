const cafeModel = require("./models/cafeModel");
const reviewModel = require("./models/reviewModel");
const foursquare = require("./helper/foursquare");

var findCafe = (req, res) => {
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

exports.findCafe = findCafe;
exports.postCafe = postCafe;
exports.postBloggerReview = postBloggerReview;
