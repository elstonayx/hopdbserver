const cafeModel = require("./../models/cafeModel");

var randomCafe = async res => {
  var selectedCafe;
  await cafeModel.Cafe.count(async (err, count) => {
    var random = Math.floor(Math.random * count);

    await cafeModel.Cafe.findOne()
      .skip(random)
      .exec((err, result) => {
        if (err) res.send(err);
        console.log(result);
        res.json(result);
      });
  });
};

exports.randomCafe = randomCafe;
