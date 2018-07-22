const cafeModel = require("./../models/cafeModel");
const foursquare = require("../helper/extractCafe");
const response = require("./../helper/status").response;

var findCafe = (req, res) => {
  if (req.query.fsVenueId == null)
    res.json(response(400, "Foursquare VenueId not found."));
  else
    cafeModel.Cafe.findOne(
      { fsVenueId: req.query.fsVenueId },
      async (err, data) => {
        var cafeResults = data;
        if (err) {
          res.send(err);
        }
        if (data == null) {
          console.log("Pulling from Foursquare...");
          cafeResults = await foursquare.findCafe(req.query.fsVenueId);
          await cafeResults.save((err, data) => {
            if (err) {
              console.log(err);
              res.json(response(400, "unable to pull from Foursquare."));
            } else {
              console.log("Saved", cafeResults.name, "to database!");
              countQueries(req.query.fsVenueId); //added such that the next query will be consistent
            }
          });
        } else await countQueries(req.query.fsVenueId);
        res.json(cafeResults);
      }
    );
};

//DEPRECATED - extracting cafes from foursquare already
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
  var fsVenueId = req.body.fsVenueId;
  cafeModel.Cafe.findOne({ fsVenueId: fsVenueId }, (err, currentCafe) => {
    console.log(currentCafe);
    if (err) {
      console.log(err);
      res.json(response(400, "Unable to find cafe."));
    } else {
      currentCafe.set(req.body);
      console.log(currentCafe);
      currentCafe.save(err => {
        if (err) {
          console.log(err);
          res.status(400).json(response(400, "Unable to save curent cafe."));
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

var countQueries = fsVenueId => {
  cafeModel.Cafe.findOneAndUpdate(
    { fsVenueId: fsVenueId },
    { $inc: { noOfTimesQueried: 1 } },
    (err, result) => {
      if (err) {
        console.log(err);
      } else if (result == null) {
        console.log("NULL ERROR FOR ADDING QUERIES");
      }
    }
  );
};

exports.findCafe = findCafe;
exports.postCafe = postCafe;
exports.patchCafe = patchCafe;
