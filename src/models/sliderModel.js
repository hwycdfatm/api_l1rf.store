const mongoose = require('mongoose')

const sliderSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			default: 'Một sản phẩm tuyệt vời đến từ vị trí của Shop :3',
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
