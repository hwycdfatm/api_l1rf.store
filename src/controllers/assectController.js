const Assect = require('../models/assectModel')

const assectController = {
	get: async (req, res) => {
		try {
			const result = await Assect.find()
			if (!result)
				return res
					.status(404)
					.json({ status: 'Fail', message: 'Có lỗi xảy ra rồi!' })
			return res.status(200).json({ status: 'Success', data: result })
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},
	update: async (req, res) => {
		try {
			const id = req.params.id
			const {
				fb,
				rateVNtoUSD,
				instagram,
				twitter,
				ship,
				phone,
				email,
				privacy,
			} = req.body
			const result = await Assect.findByIdAndUpdate(id, {
				fb,
				rateVNtoUSD,
				instagram,
				twitter,
				ship,
				phone,
				email,
				privacy,
			})
			if (!result)
				return res
					.status(404)
					.json({ status: 'Fail', message: 'Có lỗi xảy ra rồi!' })
			return res
				.status(200)
				.json({ status: 'Success', message: 'Cập nhật thành công' })
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},
}

module.exports = assectController
