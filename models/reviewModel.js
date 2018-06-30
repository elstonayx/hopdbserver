const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var bloggerReviewSchema = new Schema({
  cafe_id: { type: String, required: true },
  url: { type: String, required: true },
  reviewSite: String,
  reviewDate: Date,
  reviewerName: String,
  extract: { type: String, maxlength: 100 }
});

module.exports = {
  BloggerReview: mongoose.model("bloggerReviews", bloggerReviewSchema)
};
