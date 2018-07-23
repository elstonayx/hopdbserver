const cafeModel = require("./../models/cafeModel");

var randomCafe = async res => {
  await cafeModel.Cafe.count(async (err, count) => {
    var random = Math.floor(Math.random * count);

    await cafeModel.Cafe.findOne()
      .skip(random)
      .exec((err, result) => {
        if (err) res.send(err);
        res.json(result);
      });
  });
};

var popularCafes = async res => {
  await cafeModel.Cafe.find()
    .sort("-noOfTimesQueried")
    .limit(5)
    .exec((err, results) => {
      if (err) {
        console.log(err);
        res.json(response(400, err));
      } else {
        res.json(results);
      }
    });
};

exports.randomCafe = randomCafe;
exports.popularCafes = popularCafes;
