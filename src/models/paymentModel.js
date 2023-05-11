const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')
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
		phone: {
			type: String,
			required: true,
		},
		paymentID: {
			type: String,
			required: true,
			unique: true,
		},
		address: {
			type: Object,
			required: true,
			default: {
				province: '',
				district: '',
				ward: '',
			},
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
			default: 'COD',
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
paymentSchema.plugin(mongooseDelete, {
	overrideMethods: 'all',
	deletedAt: true,
})
module.exports = mongoose.model('Payment', paymentSchema)
