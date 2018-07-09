const cafeModel = require("./../models/cafeModel");
const foursquare = require("./../helper/foursquare");

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
      if (err) {
        res.send(err);
      }
      if (data == null) {
        console.log("Pulled from Foursquare");
        cafeResults = await foursquare.findCafe(req.query.fsVenueId);
        cafeResults.save({}, { setDefaultsOnInsert: true }, (err, data) => {
          console.log("Saved", cafeResults.name, "to database!");
          if (err) console.log(err);
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

exports.findCafe = findCafe;
exports.postCafe = postCafe;
exports.patchCafe = patchCafe;
