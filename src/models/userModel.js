const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		avatar: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		phone: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		address: {
			type: String,
		},
		role: {
			type: String,
			default: 'member',
		},
		cart: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
