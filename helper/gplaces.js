const request = require("request-promise");
const dotenv = require("dotenv");

dotenv.load();

var searchCafe = async cafeName => {
  console.log(cafeName);
  var placeId;
  var results;
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
    async (err, res, body) => {
      if (err) {
        console.log(err);
      } else {
        if (body == null) return console.log("Empty body.");
        else {
          placeId = await JSON.parse(body).results[0].place_id;
        }
      }
    }
  );
  results = await photoReferenceFromPlaceId(placeId);
  console.log(results);
  return results;
};

var photoReferenceFromPlaceId = async placeId => {
  var results;
  await request(
    {
      uri: "https://maps.googleapis.com/maps/api/place/details/json",
      method: "GET",
      qs: {
        placeid: placeId,
        fields: "photo",
        key: process.env.G_PLACES_API_KEY
      }
    },
    async (err, res, body) => {
      if (err) {
        console.log(err);
      } else {
        console.log(body);
        results = await JSON.parse(body).result.photos;
        //console.log(results);
        //return results;
      }
    }
  );
  return results;
};

exports.searchCafe = searchCafe;
