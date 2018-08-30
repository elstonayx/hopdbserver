const request = require("request-promise");
const dotenv = require("dotenv");

dotenv.load();

var searchCafe = async (cafeName, lat, lng) => {
  var placeId;
  var results;
  //console.log(process.env.G_PLACES_API_KEY);
  await request(
    {
      uri: "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
      method: "GET",
      qs: {
        key: process.env.G_PLACES_API_KEY,
        input: cafeName,
        inputtype: "textquery",
        locationbias: "circle:100@" + lat + "," + lng
      }
    },
    async (err, res, body) => {
      if (err) {
        console.log(err);
      } else {
        body = JSON.parse(body);
        if (body.status == "INVALID_REQUEST") console.log("Empty body.");
        else if (body.status != "OK") {
          console.log("gplaces error", body.status);
        } else {
          placeId = await body.candidates[0].place_id;
        }
      }
    }
  );
  if (!placeId) {
    return null;
  }
  results = await photoReferenceFromPlaceId(placeId);
  return results;
};

var photoReferenceFromPlaceId = async placeId => {
  var results;
  var openingHours;
  var website;
  var rating;
  var price_level;
  var body;
  await request(
    {
      uri: "https://maps.googleapis.com/maps/api/place/details/json",
      method: "GET",
      qs: {
        placeid: placeId,
        fields: "photo,opening_hours,url,website,rating,price_level",
        key: process.env.G_PLACES_API_KEY
      }
    },
    async (err, res, body) => {
      if (err) {
        console.log(err);
      } else {
        body = await JSON.parse(body);
        if (body.status == "OK") {
          results = body.result.photos;
          openingHours = body.result.opening_hours;
          website = body.result.website;
          rating = body.result.rating;
          price_level = body.result.price_level ? body.result.price_level : -1;
        }
      }
    }
  );
  if (body.status == "INVALID_REQUEST") return;
  var urlArray = [];
  for (var i = 0; i < results.length && i < 5; i++) {
    urlArray.push(
      returnPhotoUrlFromPhotoReferenceId(results[i].photo_reference)
    );
  }
  return [urlArray, openingHours, website, rating, price_level];
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
