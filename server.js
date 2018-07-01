const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const dbFunction = require("./database");
const foursquareCall = require("./helper/foursquare");
const app = express();

dotenv.load();
app.use(bodyParser.urlencoded({ extended: true }));

//connect to database and start listening on port
mongoose.connect(
  process.env.MONGO_URI,
  err => {
    if (err) return console.log(err);
    app.listen(process.env.PORT || 3000, () => {
      console.log("Listening on port %d...", process.env.PORT || 3000);
    });
  }
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

//Retrieving Cafe Data
app.get("/cafe", dbFunction.findCafe);

//Posting Cafe Data
app.post("/cafe", dbFunction.postCafe);

//Posting BloggerReview Data
app.post("/bloggerReviews", dbFunction.postBloggerReview);

//openPage
app.get("/foursquare/cafe", foursquareCall.findCafe);
