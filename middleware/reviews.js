const reviewModel = require("./../models/reviewModel");
const response = require("./../helper/status").response;

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
  var query;
  await reviewModel.BloggerReview.find(
    { fsVenueId: fsVenueId },
    (err, data) => {
      if (err) return console.log(err);
      query = data;
    }
  );
  res.json(query);
};

var postHopperReview = (req, res) => {
  console.log(req.body);
  var newHopperReview = new reviewModel.HopperReview(req.body);
  newHopperReview.save((err, data) => {
    if (err) return console.log(err);
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
