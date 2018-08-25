const userModel = require("./../models/userModel");
const response = require("./../helper/status").response;
const request = require("request-promise");

//to be fixed based on current model
var saveCafeToUser = async (req, res) => {
  const fsVenueId = req.body.fsVenueId;
  const data = await fetchFsInformation(fsVenueId);
  await userModel.User.findOneAndUpdate(
    { userId: req.body.userId },
    { $addToSet: { savedCafes: data } },
    (err, doc) => {
      if (err || !doc) {
        console.log(err);
        res.send(response(400, err));
      } else {
        res.send(
          response(
            200,
            "successfully added " + fsVenueId + " into " + req.body.userId
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
  await request(
    {
      url: "https://api.foursquare.com/v2/venues/" + fsVenueId,
      method: "GET",
      qs: {
        client_id: process.env.FOURSQUARE_CLIENT_ID,
        client_secret: process.env.FOURSQUARE_CLIENT_SECRET,
        v: "20180822"
      }
    },
    function(err, res, body) {
      if (err) {
        console.log(err);
      } else {
        cafeInfo = parseFsData(JSON.parse(body));
      }
    }
  );
  return cafeInfo;
};

var parseFsData = fsData => {
  return {
    fsVenueId: fsData.response.venue.id,
    name: fsData.response.venue.name,
    thumbnail: fsData.response.venue.photos.count
      ? fsData.response.venue.photos.groups[1].items["0"].prefix +
        "90x90" +
        fsData.response.venue.photos.groups[1].items["0"].suffix
      : ""
  };
};

exports.saveCafeToUser = saveCafeToUser;
exports.deleteCafeFromUser = deleteCafeFromUser;
