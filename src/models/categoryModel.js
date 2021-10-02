const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')
const categorySchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		image: {
			type: String,
			default: '',
		},
		slug: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
)
categorySchema.plugin(mongooseDelete, {
	overrideMethods: 'all',
	deletedAt: true,
})
module.exports = mongoose.model('Category', categorySchema)
