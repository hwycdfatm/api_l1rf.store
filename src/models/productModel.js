const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
	{
		product_id: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			default: 'Một sản phẩm tuyệt vời đến từ vị trí của Shop :3',
		},
		image: {
			type: Object,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		slug: {
			type: String,
			required: true,
			trim: true,
		},
		price: {
			type: Number,
			required: true,
		},
		inStock: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Product', productSchema)
