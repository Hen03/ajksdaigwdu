let { Schema, model } = require("mongoose")

let schema = new Schema({
    Public: Boolean
})

let stock = model("stock", schema)

module.exports = stock