const userModel = require("./../models/userModel");
const response = require("./../helper/status").response;

var saveCafeToUser = async (req, res) => {
  await userModel.User.findOneAndUpdate(
    { userId: req.body.userId },
    { $addToSet: { savedCafes: req.body.fsVenueId } },
    (err, doc) => {
      if (err || !doc) {
        console.log(err);
        res.send(response(400, err));
      } else {
        res.send(
          response(
            200,
            "successfully added " +
              req.body.fsVenueId +
              " into " +
              req.body.userId
          )
        );
      }
    }
  );
};

var deleteCafeFromUser = async (req, res) => {
  await userModel.User.findOneAndUpdate(
    { userId: req.body.userId },
    { $pull: { savedCafes: req.body.fsVenueId } },
    (err, doc) => {
      if (err || !doc) {
        console.log(err);
        res.send(response(400, err));
      } else
        res.send(
          response(
            200,
            "Successfully removed " +
              req.body.fsVenueId +
              " from " +
              req.body.userId
          )
        );
    }
  );
};

exports.saveCafeToUser = saveCafeToUser;
exports.deleteCafeFromUser = deleteCafeFromUser;
