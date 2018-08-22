const userModel = require("./../models/userModel");
const response = require("./../helper/status").response;
const request = require("request-promise");
const dotenv = require("dotenv");

//to be fixed based on current model
var saveCafeToUser = async (req, res) => {
  const fsVenueId = req.body.fsVenueId;

  await userModel.User.findOneAndUpdate(
    { userId: req.body.userId },
    { $addToSet: { savedCafes: { fsVenueId: req.body.fsVenueId } } },
    (err, doc) => {
      if (err || !doc) {
        console.log(err);
        res.send(response(400, err));
      } else {
        res.send(
          response(
            200,
            "successfully added " +
              req.body.fsVenueId +
              " into " +
              req.body.userId
          )
        );
      }
    }
  );
};

var deleteCafeFromUser = async (req, res) => {
  await userModel.User.findOneAndUpdate(
    { userId: req.body.userId },
    { $pull: { savedCafes: { fsVenueId: req.body.fsVenueId } } },
    (err, doc) => {
      if (err || !doc) {
        console.log(err);
        res.send(response(400, err));
      } else
        res.send(
          response(
            200,
            "Successfully removed " +
              req.body.fsVenueId +
              " from " +
              req.body.userId
          )
        );
    }
  );
};

var fetchFsInformation = async fsVenueId => {
  var cafeInfo;
  await request({
    url: "https://api.foursquare.com/v2/venues/" + fsVenueId,
    method: "GET",
    qs: {
      client_id: process.env.FOURSQUARE_CLIENT_ID,
      client_secret: process.env.FOURSQUARE_CLIENT_SECRET,
      v: "20180822"
    },
    function(err, res, body) {
      if (err) {
        console.log(err);
      } else {
        cafeInfo = JSON.parse(body);
      }
    }
  });
};

exports.saveCafeToUser = saveCafeToUser;
exports.deleteCafeFromUser = deleteCafeFromUser;
