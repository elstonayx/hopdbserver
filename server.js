const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const database = require("./database");
const foursquareCall = require("./helper/foursquare");
const config = require("./config.json");
const authenticate = require("./authenticate");

const app = express();
dotenv.load();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

console.log("Starting up Hop Database Server");
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

app.post("/newUser", authenticate.addUser);

app.post("/login", authenticate.userLogin);

app.get("/nouserlogin", authenticate.noUserLogin);

//checks if requester has valid token
if (config.AUTH_ENABLED) {
  app.use("/", authenticate.verifyToken);
}

//Retrieving Cafe Data
app.get("/cafe/data", database.findCafe);

app.get("/cafe/review", database.findBloggerReview);

app.post("/cafe/review", database.postHopperReview);

//Posting Cafe Data
app.post("/cafe", database.postCafe);

//Posting BloggerReview Data
app.post("/bloggerReviews", database.postBloggerReview);

//openPage
app.get("/foursquare/cafe", async (req, res) => {
  var photos = await foursquareCall.findCafe(req.query.fsVenueId);
  res.json(photos);
});
