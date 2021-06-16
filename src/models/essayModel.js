const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Essay = new Schema(
	{
		title: {
			type: String,
			require: true,
		},
		content: {
			type: String,
			require: true,
		},
		author: {
			type: String,
			require: true,
			default: 'Vô danh',
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Essay', Essay)
