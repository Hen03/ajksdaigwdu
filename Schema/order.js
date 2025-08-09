let { Schema, model } = require("mongoose");

let schema = new Schema({
  Order: {
    type: Number,
    default: 0,
    required: true,
  }
});

let order = model("order", schema);

module.exports = order;
