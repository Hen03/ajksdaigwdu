let { Schema, model } = require("mongoose")

let sche = new  Schema({
	code: String,
	data: String,
})

let shop = model("shop", sche)

module.exports = shop