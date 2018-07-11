const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//need to add description, openingHours
var cafeSchema = new Schema({
  name: { type: String, required: true },
  fsVenueId: { type: String, unique: true },
  bloggerRating: { type: Number, min: 0, max: 5 },
  hopperRating: { type: Number, min: 0, max: 5 },
  priceRange: { type: Number, min: 1, max: 3 },
  images: [String],
  url: String,
  facebookPage: String,
  contactNo: String,
  contactEmail: String,
  address: { type: String, required: true },
  postalCode: { type: String },
  latitude: Number,
  longitude: Number,
  amenities: {
    type: Array,
    default: [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false
    ]
    /*
    cardPayment: { type: Boolean, default: false },
    halal: { type: Boolean, default: false },
    studying: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    reservations: { type: Boolean, default: false },
    powerSocket: { type: Boolean, default: false },
    transit: { type: Boolean, default: false },
    vegetarian: { type: Boolean, default: false },
    water: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false }
    */
  },
  lastUpdated: Date
});

//define index for search
cafeSchema.index({ fsVenueId: true });

module.exports = {
  Cafe: mongoose.model("cafes", cafeSchema)
};
