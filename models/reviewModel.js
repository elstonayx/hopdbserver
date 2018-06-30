const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var bloggerReviewSchema = new Schema({
  fsVenueId: { type: String, required: true },
  url: { type: String, required: true },
  reviewSite: String,
  reviewDate: String,
  reviewerName: String,
  extract: { type: String, maxlength: 200 }
});

module.exports = {
  BloggerReview: mongoose.model("bloggerreviews", bloggerReviewSchema)
};
