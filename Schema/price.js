let { Schema, model } = require("mongoose")

let schema = new Schema({
	code: String,
	price: Number
})

let price = model("Price", schema)

module.exports = price