const request = require("request-promise");
const dotenv = require("dotenv");

dotenv.load();

//REQUIRES FIXING
//BUG - cannot search by cafeName in gplaces, might come out "starbucks", but multiple starbucks locations
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
        if (body.status == "INVALID_REQUEST") console.log("Empty body.");
        else {
          placeId = await JSON.parse(body).results[0].place_id;
        }
      }
    }
  );
  results = await photoReferenceFromPlaceId(placeId);
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
  var urlArray = [];
  for (var i = 0; i < results.length && i < 5; i++) {
    urlArray.push(
      returnPhotoUrlFromPhotoReferenceId(results[i].photo_reference)
    );
  }
  return urlArray;
};

var returnPhotoUrlFromPhotoReferenceId = photoReference => {
  return (
    "https://maps.googleapis.com/maps/api/place/photo?" +
    "photoreference=" +
    photoReference +
    "&maxwidth=960&key=" +
    process.env.G_PLACES_API_KEY
  );
};

exports.searchCafe = searchCafe;
