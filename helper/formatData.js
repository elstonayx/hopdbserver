const mongoose = require("mongoose");
const cafeModel = require("./../models/cafeModel");

packageCafeModel = rawCafeData => {
  var package = new cafeModel.Cafe({
    name: rawCafeData.response.venue.name,
    fsVenueId: rawCafeData.response.venue.id,
    url: rawCafeData.response.venue.canonicalUrl,
    contactNo: rawCafeData.response.venue.contact.formattedPhone,
    address: rawCafeData.response.venue.location.formattedAddress[0],
    latitude: rawCafeData.response.venue.location.lat,
    longitude: rawCafeData.response.venue.location.lng,
    lastUpdated: Date.now()
  });

  return package;
};

exports.packageCafeModel = packageCafeModel;
