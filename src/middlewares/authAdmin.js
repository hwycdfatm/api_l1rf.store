const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const authAdmin = async (req, res, next) => {
	try {
		const user = await User.findOne({
			_id: req.user.id,
		})

		if (user.role === 'admin') return next()

		return res.status(400).json({ message: 'Bạn không phải Admin' })
	} catch (error) {
		return res.status(500).json({ message: erorr.message })
	}
}

module.exports = authAdmin
