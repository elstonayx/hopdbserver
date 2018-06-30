const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const dotenv = require("dotenv");

const cafeModel = require("./models/cafeModel.js");
const reviewModel = require("./models/reviewModel.js");

const app = express();

dotenv.load();
app.use(bodyParser.urlencoded({ extended: true }));
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
app.get("/cafe", (req, res) => {
  console.log(req.query.name);
  cafeModel.Cafe.find(
    { name: { $regex: req.query.name, $options: "i" } },
    (err, data) => {
      if (err) return res.send(err);
      res.send(data);
    }
  );
});

//Posting Cafe Data
app.post("/cafe", (req, res) => {
  var newCafe = new cafeModel.Cafe(req.query);
  newCafe.save((err, data) => {
    if (err) return console.log(err);
    res.send(data);
  });
});

//Retrieving BloggerReview Data

//Posting BloggerReview Data
app.post("/bloggerReviews", (req, res) => {
  var newBloggerReview = new reviewModel.BloggerReview(req.query);
  newBloggerReview.save((err, data) => {
    if (err) return console.log(err);
    res.send(data);
  });
});
