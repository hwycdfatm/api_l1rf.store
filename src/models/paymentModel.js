const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema(
	{
		user_ID: {
			type: String,
			required: true,
		},
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
			unique: true,
		},
		address: {
			type: String,
			required: true,
		},
		order: {
			type: Array,
			required: true,
		},
		status: {
			type: Number,
			default: 1, // 1 là đặt hàng thành công, 2 là đã chuyển hàng, 3 là đã bán thành công
		},
		method: {
			type: String,
			required: true,
		},
		total: {
			type: Number,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Payment', paymentSchema)
