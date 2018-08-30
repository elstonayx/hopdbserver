const cafeModel = require("./../models/cafeModel");

packageCafeModel = (
  rawCafeData,
  photoArray,
  openingHours,
  url,
  rating,
  price_level
) => {
  if (openingHours != null) openingHours = arrangeOpeningHours(openingHours);
  var package = new cafeModel.Cafe({
    name: rawCafeData.response.venue.name,
    fsVenueId: rawCafeData.response.venue.id,
    bloggerRating: rating,
    priceRange: price_level,
    url: url,
    images: photoArray,
    contactNo: rawCafeData.response.venue.contact.formattedPhone,
    address: [
      rawCafeData.response.venue.location.formattedAddress[0] + ",",
      rawCafeData.response.venue.location.formattedAddress[2],
      rawCafeData.response.venue.location.formattedAddress[1]
    ].join(" "),
    postalCode: rawCafeData.response.venue.location.formattedAddress[1],
    latitude: rawCafeData.response.venue.location.lat,
    longitude: rawCafeData.response.venue.location.lng,
    shopHours: openingHours,
    lastUpdated: Date.now()
  });

  return package;
};

function arrangeOpeningHours(openingHours) {
  var resultArray = [];
  for (var i = 0; i < 7; i++)
    resultArray.push({
      isOpened: false,
      open: "0000",
      closed: "0000"
    });
  for (var i = 0; i < openingHours.periods.length; i++) {
    resultArray[openingHours.periods[i].open.day].isOpened = true;
    resultArray[openingHours.periods[i].open.day].open =
      openingHours.periods[i].open.time;
    resultArray[openingHours.periods[i].open.day].closed = openingHours.periods[
      i
    ].close
      ? openingHours.periods[i].close.time
      : "0000";
  }
  return resultArray;
}

exports.packageCafeModel = packageCafeModel;
