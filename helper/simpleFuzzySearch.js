const request = require("request-promise");
const dotenv = require("dotenv");

//to be fixed so that photos are fetched too
var findCafe = async query => {
  var results = [];
  var locationCafe = await findCafeByLocation(query);
  var nameCafe = await findCafeByName(query);
  if (nameCafe.meta.code != 400) {
    results = results.concat(nameCafe.response.group.results);
  }
  if (locationCafe.meta.code != 400) {
    //results = results.concat(locationCafe.response.group.results);
  }
  return results;
};

var findCafeByLocation = async query => {
  var cafeData;
  await request(
    {
      url: "https://api.foursquare.com/v2/search/recommendations?",
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
      url: "https://api.foursquare.com/v2/search/recommendations?",
      method: "GET",
      qs: {
        near: "Singapore",
        client_id: process.env.FOURSQUARE_CLIENT_ID,
        client_secret: process.env.FOURSQUARE_CLIENT_SECRET,
        v: "20180701",
        intent: "food",
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

//process:
//1. get from /venues/search
//2. save name and fsVenueId from that result
//3. call photo search
//4. save thumbnail from that result
//5. return results
