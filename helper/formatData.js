const mongoose = require("mongoose");
const gplaces = require("./gplaces");
const cafeModel = require("./../models/cafeModel");

packageCafeModel = async rawCafeData => {
  var photoArray = await gplaces.searchCafe(rawCafeData.response.venue.name);
  var package = new cafeModel.Cafe({
    name: rawCafeData.response.venue.name,
    fsVenueId: rawCafeData.response.venue.id,
    url: rawCafeData.response.venue.canonicalUrl,
    images: photoArray,
    contactNo: rawCafeData.response.venue.contact.formattedPhone,
    address: [
      rawCafeData.response.venue.location.formattedAddress[0] + ",",
      rawCafeData.response.venue.location.formattedAddress[2],
      rawCafeData.response.venue.location.formattedAddress[1]
    ].join(" "),
    latitude: rawCafeData.response.venue.location.lat,
    longitude: rawCafeData.response.venue.location.lng,
    lastUpdated: Date.now()
  });

  return package;
};

exports.packageCafeModel = packageCafeModel;
