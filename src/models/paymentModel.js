const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		paymentID: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		cart: {
			type: Array,
			required: true,
		},
		status: {
			type: Number,
			default: 1,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Payment', paymentSchema)
