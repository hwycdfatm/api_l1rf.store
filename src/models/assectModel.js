const mongoose = require('mongoose')

const assectSchema = mongoose.Schema(
	{
		address: {
			type: String,
		},
		ship: {
			type: Number,
		},
		rateVNtoUSD: {
			type: String,
		},
		fb: { type: String },
		instagram: { type: String },
		twitter: { type: String },
		email: { type: String },
		phone: { type: String },
		privacy: { type: String },
	},
	{
		timestamps: true,
	}
)
module.exports = mongoose.model('Assect', assectSchema)
