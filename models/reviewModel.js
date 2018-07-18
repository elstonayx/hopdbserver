const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var bloggerReviewSchema = new Schema({
  fsVenueId: { type: String, required: true },
  url: { type: String, required: true },
  reviewSite: String,
  //reviewDate: String,
  //reviewerName: String,
  title: String,
  extract: { type: String }
});

var hopperReviewSchema = new Schema({
  fsVenueId: { type: String, required: true },
  reviewerId: { type: String, required: true },
  reviewDate: Date,
  rating: { type: Number, min: 0, max: 5 },
  content: { type: String },
  photos: [String] //url links
});

module.exports = {
  BloggerReview: mongoose.model("bloggerreviews", bloggerReviewSchema),
  HopperReview: mongoose.model("hopperreviews", hopperReviewSchema)
};
