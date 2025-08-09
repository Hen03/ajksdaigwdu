let { Schema, model } = require("mongoose")

let schema = new Schema({
    ChanelTesti: String,
    ChannelStock: String,
    MessageID: String,
    Delay: String,
});

let setchannel = model("setchannel", schema)

module.exports = setchannel