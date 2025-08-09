let { Schema, model } = require("mongoose");

let schema = new Schema({
  world: String,
  owner: String,
  botName: String,
  ratedl: String,
  saweria: String,
  Trakteer: String
});

let depo = model("depo", schema);

module.exports = depo;
