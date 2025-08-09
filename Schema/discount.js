let { Schema, model } = require("mongoose")

let schema = new Schema({
	code: String,
	price: Number
})

let Discount = model("Discount", schema)

module.exports = Discount