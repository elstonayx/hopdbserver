const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var cafeSchema = new Schema({
  name: { type: String, required: true },
  fsVenueId: { type: String },
  bloggerRating: { type: Number, min: 0, max: 5 },
  hopperRating: { type: Number, min: 0, max: 5 },
  priceRange: { type: Number, min: 1, max: 3 },
  images: [String],
  url: String,
  contactNo: String,
  contactEmail: String,
  address: { type: String, required: true },
  latitude: Number,
  longitude: Number,
  amenities: {
    cardPayment: Boolean,
    halal: Boolean,
    studying: Boolean,
    parking: Boolean,
    reservations: Boolean,
    powerSocket: Boolean,
    transit: Boolean,
    vegetarian: Boolean,
    water: Boolean,
    wifi: Boolean
  },
  lastUpdated: Date
});

module.exports = {
  Cafe: mongoose.model("cafes", cafeSchema)
};
