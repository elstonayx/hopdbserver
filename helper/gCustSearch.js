const request = require("request-promise");
const dotenv = require("dotenv");

dotenv.load();

var extractBloggerReviews = async cafeName => {
  var data;
  await request(
    {
      url: "https://www.googleapis.com/customsearch/v1",
      method: "GET",
      qs: {
        q: cafeName,
        cr: "sg",
        cx: "013976597357521975421:wtlqa3yucmw",
        key: process.env.G_SEARCH_API_KEY
      }
    },
    (err, res, body) => {
      if (err) {
        console.log(err);
      } else {
        data = JSON.parse(body);
      }
    }
  );
  var resultArray = [];
  for (var i = 0; i < data.items.length && i < 5; i++) {
    resultArray.push({
      url: data.items[i].link,
      reviewSite: data.items[i].displayLink,
      title: data.items[i].title,
      extract: data.items[i].snippet
    });
  }
  return resultArray;
};

exports.extractBloggerReviews = extractBloggerReviews;
