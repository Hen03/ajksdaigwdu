let { Schema, model } = require("mongoose")

let schema = new Schema({
    Chanel: String
})

let ctesti = model("cstock", schema)

module.exports = ctesti