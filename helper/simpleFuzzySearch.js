const request = require("request-promise");
const dotenv = require("dotenv");

var findCafe = async query => {
  var results = [];
  var locationCafe = await findCafeByLocation(query);
  var nameCafe = await findCafeByName(query);
  if (nameCafe.meta.code != 400) {
    results = results.concat(nameCafe.response.venues);
  }
  if (locationCafe.meta.code != 400) {
    results = results.concat(locationCafe.response.venues);
  }
  return results;
};

var findCafeByLocation = async query => {
  var cafeData;
  await request(
    {
      url: "https://api.foursquare.com/v2/venues/search?",
      method: "GET",
      qs: {
        client_id: process.env.FOURSQUARE_CLIENT_ID,
        client_secret: process.env.FOURSQUARE_CLIENT_SECRET,
        v: "20180701",
        near: query + ",SG",
        radius: "1500",
        limit: 15,
        categoryId: "4bf58dd8d48988d16d941735"
      },
      simple: false
    },
    function(err, res, body) {
      if (err) {
        console.log(err);
      } else {
        cafeData = JSON.parse(body);
      }
    }
  );
  return cafeData;
};

var findCafeByName = async query => {
  var cafeData;
  await request(
    {
      url: "https://api.foursquare.com/v2/venues/search?",
      method: "GET",
      qs: {
        client_id: process.env.FOURSQUARE_CLIENT_ID,
        client_secret: process.env.FOURSQUARE_CLIENT_SECRET,
        v: "20180701",
        intent: "browse",
        ne: "1.476056,104.032035",
        sw: "1.225227,103.535489",
        limit: 3,
        query: query,
        categoryId: "4bf58dd8d48988d16d941735"
      }
    },
    function(err, res, body) {
      if (err) console.log(err);
      else {
        cafeData = JSON.parse(body);
      }
    }
  );
  return cafeData;
};

exports.findCafe = findCafe;
