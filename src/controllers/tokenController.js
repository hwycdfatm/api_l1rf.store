const Token = require('../models/tokenModel')
const tokenController = {
	checkToken: async (req, res) => {
		try {
			const blackListOfToken = await Token.findOne({
				token: req.header('Authorization'),
			})

			if (blackListOfToken)
				return res
					.status(400)
					.json({ status: 'Token-used', message: 'Liên kết đã hết hạn' })

			return res
				.status(200)
				.json({ status: 'Success', message: 'Token hợp lệ' })
		} catch (err) {
			return res.status(500).json({ msg: err.message })
		}
	},
}

module.exports = tokenController
