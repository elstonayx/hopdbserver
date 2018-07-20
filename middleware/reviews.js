const reviewModel = require("./../models/reviewModel");
const cafeModel = require("./../models/cafeModel");
const response = require("./../helper/status").response;
const gsearch = require("./../helper/gCustSearch");

var postBloggerReview = (req, res) => {
  var newBloggerReview = new reviewModel.BloggerReview(req.query);
  newBloggerReview.save((err, data) => {
    if (err) return console.log(err);
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
        return console.log(err);
      } else if (result.length != 0) {
        res.json(result);
      } else {
        var cafeName;
        await cafeModel.Cafe.findOne(
          { fsVenueId: fsVenueId },
          async (err, result) => {
            if (err) return console.log(err);
            else if (result == null) return console.log("no such fsVenueId");
            else {
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
  console.log(req.body);
  var newHopperReview = new reviewModel.HopperReview(req.body);
  newHopperReview.save((err, data) => {
    if (err) return console.log(err);
    else if (result.reviewerId == "elstonayx")
      return res.send("xianhao is not allowed to post reviews under my name");
    res.status(200).json({
      success: true,
      message: "Successfully posted hopper review!"
    });
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

exports.findBloggerReview = findBloggerReview;
exports.postBloggerReview = postBloggerReview;

exports.postHopperReview = postHopperReview;
exports.getHopperReview = getHopperReview;
