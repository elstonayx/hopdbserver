const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const database = require("./database");
const foursquareCall = require("./helper/foursquare");
const config = require("./config.json");
const authenticate = require("./authenticate");
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
app.get("/cafe/data", database.findCafe);

app.put("/cafe/data", database.patchCafe);

/* blogger review routes */
app.get("/cafe/review/blogger", database.findBloggerReview);

app.post("/cafe/review/blogger", database.postBloggerReview);

/*hopper review routes */
app.post("/cafe/review/hopper", database.postHopperReview);

app.get("/cafe/review/hopper", database.getHopperReview);

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
app.post("/cafe/data", database.postCafe);
