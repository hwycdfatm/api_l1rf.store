const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')
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
		activate: {
			type: Boolean,
			default: true,
		},
		cart: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true }
)

userSchema.plugin(mongooseDelete, {
	overrideMethods: 'all',
	deletedAt: true,
})

module.exports = mongoose.model('User', userSchema)
