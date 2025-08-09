let { Schema, model } = require("mongoose");

let schema = new Schema({
  GrowID: {
    type: String,
    required: true,
  },
  GrowIDNow: {
    type: String,
    required: true,
  },
  DiscordID: {
    type: String,
    required: true,
  },
  Balance: {
    type: Number,
    default: 0,
    required: true,
  },
  Deposit: {
    type: Number,
    default: 0,
    required: true,
  },
});

let Bal = model("Bal", schema);

module.exports = Bal;
