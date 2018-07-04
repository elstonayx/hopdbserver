const request = require("request-promise");
const dotenv = require("dotenv");

dotenv.load();

var searchCafe = async cafeName => {
  console.log(cafeName);
  var placeId;
  //console.log(process.env.G_PLACES_API_KEY);
  await request(
    {
      uri: "https://maps.googleapis.com/maps/api/place/textsearch/json",
      method: "GET",
      qs: {
        query: cafeName,
        key: process.env.G_PLACES_API_KEY
      }
    },
    (err, res, body) => {
      if (err) {
        console.log(err);
      } else {
        console.log(body);
        //placeId = body.results.id;
      }
    }
  );
  console.log(placeId);
  return placeId;
};

exports.searchCafe = searchCafe;
