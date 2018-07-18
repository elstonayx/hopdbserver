const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//need to add openingHours
var cafeSchema = new Schema({
  name: { type: String, required: true },
  fsVenueId: { type: String, unique: true },
  bloggerRating: { type: Number, min: 0, max: 5 },
  hopperRating: { type: Number, min: 0, max: 5 },
  priceRange: { type: Number, min: 0, max: 5 },
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
    cardPayment: { type: Number, default: 0 },
    halal: { type: Number, default: 0 },
    studying: { type: Number, default: 0 },
    parking: { type: Number, default: 0 },
    reservations: { type: Number, default: 0 },
    powerSocket: { type: Number, default: 0 },
    transit: { type: Number, default: 0 },
    vegetarian: { type: Number, default: 0 },
    water: { type: Number, default: 0 },
    wifi: { type: Number, default: 0 }
  },
  shopHours: {
    type: [
      {
        _id: false,
        isOpened: { type: Boolean },
        open: { type: String },
        closed: { type: String }
      }
    ]
  },
  lastUpdated: Date
});

//TODO: figure out indexing
//define index for search
//cafeSchema.index({ fsVenueId: true });

module.exports = {
  Cafe: mongoose.model("cafes", cafeSchema)
};
