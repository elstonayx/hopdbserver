const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var authSchema = new Schema({
  authName: { type: String, unique: true },
  authKey: String,
  admin: Boolean
});

module.exports = {
  Auth: mongoose.model("auths", authSchema)
};
