const request = require("request-promise");
const dotenv = require("dotenv");
const formatData = require("./formatData");
const gplaces = require("./gplaces");

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
  //return cafeData.response.venue.photos;
  const cafeName = cafeData.response.venue.name;
  const lat = cafeData.response.venue.location.lat;
  const lng = cafeData.response.venue.location.lng;
  var gPlacesData = await gplaces.searchCafe(cafeName, lat, lng);
  if (gPlacesData != null) {
    return formatData.packageCafeModel(
      cafeData,
      gPlacesData[0],
      gPlacesData[1],
      gPlacesData[2],
      gPlacesData[3],
      gPlacesData[4]
    );
  } else return formatData.packageCafeModel(cafeData);
};

exports.findCafe = findCafe;
