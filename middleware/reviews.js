const reviewModel = require("./../models/reviewModel");
const cafeModel = require("./../models/cafeModel");
const userModel = require("./../models/userModel");

const response = require("./../helper/status").response;
const gsearch = require("./../helper/gCustSearch");

//DEPRECATED - using Google Search Scraper to get blogger reviews and extracts
var postBloggerReview = (req, res) => {
  var newBloggerReview = new reviewModel.BloggerReview(req.query);
  newBloggerReview.save((err, data) => {
    if (err) {
      res.json(response(400, err));
      return console.log(err);
    }
    res.status(200).json({
      success: true,
      message: "Successfully posted blogger review!"
    });
  });
};

var findBloggerReview = async (req, res) => {
  var fsVenueId = req.query.fsVenueId;
  await reviewModel.BloggerReview.find(
    { fsVenueId: fsVenueId },
    async (err, result) => {
      if (err) {
        res.json(response(400, err));
        return console.log(err);
      } else if (result.length != 0) {
        res.json(result);
      } else {
        var cafeName;
        await cafeModel.Cafe.findOne(
          { fsVenueId: fsVenueId },
          async (err, result) => {
            if (err) {
              res.json(response(400, err));
              return console.log(err);
            } else if (result == null) {
              res.json(response(400, "Error. No such fsVenueId."));
            } else {
              cafeName = await result.name;
            }
          }
        );
        var resultArray = await gsearch.extractBloggerReviews(cafeName);
        for (var i = 0; i < resultArray.length; i++) {
          var reviewDict = resultArray[i];
          reviewDict["fsVenueId"] = fsVenueId;
          var newBloggerReview = new reviewModel.BloggerReview(reviewDict);
          newBloggerReview.save((err, data) => {
            if (err) {
              res.json(response(400, "Error! Blogger Review save failed."));
              console.log(err);
            }
          });
        }
        res.json(resultArray);
      }
    }
  );
};

var postHopperReview = (req, res) => {
  var newHopperReview = new reviewModel.HopperReview(req.body);
  newHopperReview.save((err, data) => {
    if (err) {
      res.json(response(400, err));
      return console.log(err);
    } else {
      res.json(response(200, "Successfully posted hopper review!"));
      updateHopperRatings(req.body.fsVenueId);
      updateHopperReviewCount(req.body.reviewerId);
    }
  });
};

var getHopperReview = async (req, res) => {
  var fsVenueId = req.query.fsVenueId;
  var query;
  await reviewModel.HopperReview.find({ fsVenueId: fsVenueId }, (err, data) => {
    if (err) {
      res.json(Response(400, "Unable to get Hopper Review."));
      return console.log(err);
    }
    query = data;
  });
  res.status(200).json(query);
};

var updateHopperRatings = fsVenueId => {
  reviewModel.HopperReview.aggregate([
    {
      $match: { fsVenueId: fsVenueId }
    },
    {
      $group: {
        _id: fsVenueId,
        avg: { $avg: "$rating" }
      }
    }
  ]).exec((err, result) => {
    //console.log(result[0].avg);
    if (err) {
      console.log(err);
    } else {
      cafeModel.Cafe.findOneAndUpdate(
        { fsVenueId: fsVenueId },
        {
          hopperRating: result[0].avg
        }
      ).exec();
    }
  });
};

var updateHopperReviewCount = userId => {
  console.log("updateReviewCount");
  console.log(userId);
  userModel.User.findOneAndUpdate(
    { userId: userId },
    { $inc: { reviewCount: 1 } },
    (err, doc) => {
      if (err) console.log(err);
      //console.log(doc);
    }
  );
};

var retrieveHopperReviewsByHopperId = async (req, res) => {
  const userId = req.query.userId;
  await reviewModel.HopperReview.find({ reviewerId: userId })
    .sort({ reviewDate: -1 })
    .exec((err, results) => {
      if (err) {
        console.log(err);
        res.json(response(400, err));
      } else {
        res.json(results);
      }
    });
};

var updateHopperReview = (req, res) => {
  const reviewId = req.body.reviewId;
  reviewModel.HopperReview.findByIdAndUpdate(
    reviewId,
    { rating: req.body.rating, content: req.body.content },
    err => {
      if (err) {
        console.log(err);
        res.json(response(400, err));
      } else {
        res.json(response(200, "Success!"));
      }
    }
  );
};

exports.findBloggerReview = findBloggerReview;
exports.postBloggerReview = postBloggerReview;

exports.postHopperReview = postHopperReview;
exports.getHopperReview = getHopperReview;
exports.updateHopperReview = updateHopperReview;

exports.retrieveHopperReviewsByHopperId = retrieveHopperReviewsByHopperId;
