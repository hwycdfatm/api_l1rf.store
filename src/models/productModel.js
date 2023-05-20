const mongoose = require('mongoose')

const mongooseDelete = require('mongoose-delete')

const productSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			default: 'Một sản phẩm tuyệt vời đến từ vị trí của Shop :3',
		},
		content: {
			type: String,
			default: 'Một sản phẩm tuyệt vời đến từ vị trí của Shop :3',
		},
		images: {
			type: Array,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		size: {
			type: Array,
			required: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		price: {
			type: Number,
			required: true,
		},
		inStock: {
			type: Number,
			required: true,
			min: 0,
		},
		sold: {
			type: Number,
			default: 0,
		},
		hidden: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
)
productSchema.plugin(mongooseDelete, {
	overrideMethods: 'all',
	deletedAt: true,
})

module.exports = mongoose.model('Product', productSchema)
