let { Schema, model } = require("mongoose");

let schema = new Schema({
  KodeUnik: {
    type: String,
    required: true,
  },
  DiscordID: {
    type: String,
    required: true,
  },
  StatusPayment: {
    type: String,
    required: true,
  },
  FeeAdmin: {
    type: String,
    required: true,
  },
  Jumlah: {
    type: String,
    required: true,
  },
  JumlahDL: {
    type: String,
    required: true,
  },
  Expired: {
    type: String,
    required: true,
  },
  MessageID: {
    type: String,
    required: true,
  }
});

let qris = model("qrisPayment", schema);

module.exports = qris;
