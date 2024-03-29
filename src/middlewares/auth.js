const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const auth = (req, res, next) => {
	try {
		const token = req.header('Authorization')
		if (!token || token === 'null' || token === 'undefined')
			return res
				.status(400)
				.json({ status: 'notauth', message: 'Bạn không có quyền truy cập !' })

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
			if (error)
				return res
					.status(419)
					.json({ status: 'exptoken', message: 'Bạn đã hết phiên đang nhập' })
			const userFromDB = await User.findOne({
				_id: user.id,
			})
			if (!userFromDB)
				return res
					.status(400)
					.json({ status: 'NotFound', message: 'Tài khoản bạn bị gì rồi ~ :3' })
			if (!userFromDB.activate || userFromDB.deleted)
				return res.status(400).json({
					status: 'Lock',
					message: 'Tài khoản của bạn đã bị khóa',
				})
			req.user = userFromDB
			next()
		})
	} catch (error) {
		return res.status(500).json({ status: 'Fail', message: error.message })
	}
}

module.exports = auth
