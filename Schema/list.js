let { Schema, model } = require("mongoose")

let sche = new  Schema({
	code: String,
	name: String,
	desc: String,
	type: String,
	minimum: String,
	role: String,
	sold: {
		type: Number,
		default: 0,
		required: true,
	},
})

let list = model("list", sche)

module.exports = list