const mongoose = require('mongoose')

const sliderSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		image: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Slider', sliderSchema)
