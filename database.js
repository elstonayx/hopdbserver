const cafeModel = require("./models/cafeModel");
const reviewModel = require("./models/reviewModel");
const foursquare = require("./helper/foursquare");

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
        console.log("Pulled from Foursquare");
        cafeResults = await foursquare.findCafe(req.query.fsVenueId);
        cafeResults.save((err, data) => {
          console.log("Saved", cafeResults.name, "to database!");
          if (err) return console.log(err);
        });
      }
      res.json(cafeResults);
    }
  );
};

var postCafe = (req, res) => {
  var newCafe = new cafeModel.Cafe(req.body);
  newCafe.save((err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.status(200).json(data);
    }
  });
};

var patchCafe = async (req, res) => {
  var fsVenueId = await req.body.fsVenueId;
  cafeModel.Cafe.findOne({ fsVenueId: fsVenueId }, (err, currentCafe) => {
    console.log(currentCafe);
    if (err) {
      console.log(err);
      res.status(400).json({
        success: false,
        message: "Unable to find fsVenueId in database.",
        error: err
      });
    } else {
      currentCafe.set(req.body);
      console.log(currentCafe);
      currentCafe.save(err => {
        if (err) {
          console.log(err);
          res.status(400).json({
            success: false,
            message: "Unable to update cafe",
            error: err
          });
        }
      });
      res.status(200).json({
        success: true,
        message:
          "Successfully updated " + req.body.fsVenueId + " in the database."
      });
    }
  });
};

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
    if (err) return console.log(err);
    query = data;
  });
  res.status(200).json(query);
};

exports.findCafe = findCafe;
exports.postCafe = postCafe;
exports.patchCafe = patchCafe;

exports.findBloggerReview = findBloggerReview;
exports.postBloggerReview = postBloggerReview;

exports.postHopperReview = postHopperReview;
exports.getHopperReview = getHopperReview;
