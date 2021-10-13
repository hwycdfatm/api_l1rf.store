const mongoose = require('mongoose')

const sliderSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		image: {
			type: Object,
		},
		activate: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Slider', sliderSchema)
