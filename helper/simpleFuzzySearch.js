const request = require("request-promise");
const cafeModel = require("./../models/cafeModel");
const dotenv = require("dotenv");
const locationName = [
  "serangoon",
  "bishan",
  "ang mo kio",
  "queenstown",
  "lorong chuan",
  "tampines",
  "pasir ris",
  "jurong",
  "toa payoh",
  "yishun",
  "buona vista",
  "orchard",
  "kovan",
  "bedok",
  "somerset"
];

var findCafe = async query => {
  var results = [];
  var locationCafe = findCafeByLocation(query);
  if (locationName.find(name => name == query.toLowerCase()) == undefined) {
    var nameCafe = findCafeByName(query);
    if (!nameCafe.empty) {
      results = results.concat(await nameCafe);
    }
  }
  if (!locationCafe.empty) {
    results = results.concat(await locationCafe);
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
        cafeData = parseCafeDataByLocation(JSON.parse(body));
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
        cafeData = parseCafeDataByName(cafeData);
      }
    }
  );
  return cafeData;
};

var parseCafeDataByLocation = cafeData => {
  if (cafeData.meta.code == 400) return [];

  var results = [];
  for (var i = 0; i < cafeData.response.group.results.length; i++) {
    results.push({
      fsVenueId: cafeData.response.group.results[i].venue.id,
      name: cafeData.response.group.results[i].venue.name,
      thumbnail:
        cafeData.response.group.results[i].photo == null
          ? null
          : cafeData.response.group.results[i].photo.prefix +
            "90x90" +
            cafeData.response.group.results[i].photo.suffix,
      address: parseFormattedAddress(
        cafeData.response.group.results[i].venue.location.formattedAddress
      )
    });
  }
  return results;
};

var parseCafeDataByName = async cafeData => {
  var results = [];
  var photoUrl;
  for (var i = 0; i < cafeData.response.venues.length; i++) {
    photoUrl = await fetchThumbnailFromId(cafeData.response.venues[i].id);
    results.push({
      fsVenueId: cafeData.response.venues[i].id,
      name: cafeData.response.venues[i].name,
      address: parseFormattedAddress(
        cafeData.response.venues[i].location.formattedAddress
      ),
      thumbnail: photoUrl
    });
  }

  return results;
};

var parseFormattedAddress = addressData => {
  if (addressData.length == 3) {
    return addressData[0] + " " + addressData[2] + " " + addressData[1];
  } else if (addressData.length != 0) {
    /*var result;
    await cafeModel.Cafe.findOne(
      { fsVenueId: fsVenueId },
      async (err, data) => {
        if (err || data == null) {
          result = "Unknown Address";
        } else {
          result = data.address;
        }
      }
    );
    return result;
  }*/
    return addressData.join();
  } else return "Unknown Address";
};

var fetchThumbnailFromId = async fsVenueId => {
  var results;
  await request(
    {
      url: "https://api.foursquare.com/v2/venues/" + fsVenueId + "/photos",
      method: "GET",
      qs: {
        client_id: process.env.FOURSQUARE_CLIENT_ID,
        client_secret: process.env.FOURSQUARE_CLIENT_SECRET,
        v: "20180701",
        limit: 1
      }
    },
    function(err, res, body) {
      if (err) console.log(err);
      else {
        photoData = JSON.parse(body);
        if (photoData.response.photos.count != 0)
          results =
            photoData.response.photos.items[0].prefix +
            "90x90" +
            photoData.response.photos.items[0].suffix;
      }
    }
  );
  return results;
};

exports.findCafe = findCafe;
