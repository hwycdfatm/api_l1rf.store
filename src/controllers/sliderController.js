const Slider = require('../models/sliderModel')

const sliderController = {
	getSliders: async (req, res) => {
		try {
			const result = await Slider.find()
			if (!result)
				return res
					.status(404)
					.json({ status: 'Fail', message: 'Có lỗi xảy ra' })
			return res
				.status(200)
				.json({ status: 'Success', message: 'Thành công', sliders: result })
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},
	createSlider: async (req, res) => {
		try {
			const { title, image } = req.body

			const newSlider = new Slider({
				title,
				image,
			})

			await newSlider.save()

			return res
				.status(200)
				.json({ status: 'Success', message: 'Tạo slider thành công' })
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},
	updateSlider: async (req, res) => {
		try {
			const _id = req.params.id
			const { activate } = req.body
			const slide = await Slider.findByIdAndUpdate(_id, { activate })
			if (!slide)
				return res
					.status(404)
					.json({ status: 'Fail', message: 'Có lỗi xảy ra' })
			return res
				.status(200)
				.json({
					status: 'Success',
					message: `${activate ? 'Hiện' : 'Ẩn'} slide thành công`,
				})
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},

	deleteSlider: async (req, res) => {
		try {
			const _id = req.params.id

			if (!_id)
				return res
					.status(404)
					.json({ status: 'Fail', message: 'Vui lòng chọn slider xóa' })

			const result = await Slider.deleteOne({ _id })

			if (!result)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Có lỗi xảy ra' })

			return res
				.status(200)
				.json({ status: 'Success', message: 'Xóa thành công' })
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},
}

module.exports = sliderController
