const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const cafe = require("./middleware/cafes");
const reviews = require("./middleware/reviews");
const foursquareCall = require("./helper/foursquare");
const config = require("./config.json");
const authenticate = require("./middleware/authenticate");
const gplaces = require("./helper/gplaces");

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

/* authentication routes */
app.post("/newuser", authenticate.addUser);

app.post("/login", authenticate.userLogin);

app.get("/nouserlogin", authenticate.noUserLogin);

if (config.AUTH_ENABLED) {
  app.use("/", authenticate.verifyToken);
}

/* cafe data routes */
//Retrieving Cafe Data
app.get("/cafe/data", cafe.findCafe);

app.patch("/cafe/data", cafe.patchCafe);

/* blogger review routes */
app.get("/cafe/review/blogger", reviews.findBloggerReview);

app.post("/cafe/review/blogger", reviews.postBloggerReview);

/*hopper review routes */
app.post("/cafe/review/hopper", reviews.postHopperReview);

app.get("/cafe/review/hopper", reviews.getHopperReview);

/* debugging routes */
//openPage
app.get("/foursquare/cafe", async (req, res) => {
  var photos = await foursquareCall.findCafe(req.query.fsVenueId);
  res.json(photos);
});

app.get("/cafe/google", async (req, res) => {
  var results = await gplaces.searchCafe(req.query.name);

  res.send(results);
});

//Posting Cafe Data
app.post("/cafe/data", cafe.postCafe);
