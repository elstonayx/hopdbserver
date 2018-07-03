const request = require("request-promise");
const dotenv = require("dotenv");
const formatData = require("./formatData");

dotenv.load();

var findCafe = async fsVenueId => {
  var cafeData;
  await request(
    {
      url: "https://api.foursquare.com/v2/venues/" + fsVenueId,
      method: "GET",
      qs: {
        client_id: process.env.FOURSQUARE_CLIENT_ID,
        client_secret: process.env.FOURSQUARE_CLIENT_SECRET,
        v: "20180701"
      }
    },
    function(err, res, body) {
      if (err) {
        console.error(err);
      } else {
        cafeData = JSON.parse(body);
      }
    }
  );
  return cafeData.response.venue.photos;
  //return formatData.packageCafeModel(cafeData);
};

//input in foursquare.venue
/*
var saveToDatabase = (foursquareCafeData) => {
    var newCafe = new cafeModel.Cafe({
    })
}
*/

exports.findCafe = findCafe;
