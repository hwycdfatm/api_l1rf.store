const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userController = {
	register: async (req, res) => {
		try {
			const { name, email, password, address } = req.body

			const user = await User.findOne({ email })
			if (user)
				return res.status(400).json({ message: 'Email đã được đăng ký.' })

			if (password.length < 6)
				return res.status(400).json({ message: 'Mật khẩu tối thiểu 6 ký tự' })

			// Hash Password
			const passwordHash = await bcrypt.hash(password, 10)
			const newUser = new User({
				name,
				email,
				address,
				password: passwordHash,
			})

			// Lưu vào database
			await newUser.save()

			// Tạo ACCESS TOKEN
			const accessToken = createAccessToken({ id: newUser._id })
			const refreshToken = createRefreshToken({ id: newUser._id })

			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				path: '/user/refresh_token',
			})

			res.json({ message: 'Đăng ký thành công' })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	login: async (req, res) => {
		try {
			const { email, password } = req.body

			const user = await User.findOne({ email })

			if (!user)
				return res
					.status(400)
					.json({ message: 'Thông tin đăng nhập không hợp lệ' })

			const mathPassword = await bcrypt.compare(password, user.password)

			if (!mathPassword)
				return res
					.status(400)
					.json({ message: 'Thông tin đăng nhập không hợp lệ' })

			// Tạo ACCESS TOKEN
			const accessToken = createAccessToken({ id: user._id })
			const refreshToken = createRefreshToken({ id: user._id })

			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				path: '/user/refresh_token',
			})
			res.json({ accessToken })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	logout: async (req, res) => {
		try {
			res.clearCookie('refreshToken', { path: '/user/refresh_token' })
			return res.status(200).json({ message: 'Đăng xuất thành công!' })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	refreshToken: (req, res) => {
		try {
			const refreshToken = req.cookies.refreshToken
			if (!refreshToken)
				return res
					.status(400)
					.json({ message: 'Vui lòng đăng nhập hoặc đăng ký' })
			jwt.verify(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET,
				(error, user) => {
					if (error)
						return res
							.status(400)
							.json({ message: 'Vui lòng đăng nhập hoặc đăng ký' })
					const accessToken = createAccessToken({ id: user.id })
					res.json({ user, accessToken })
				}
			)
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	info: async (req, res) => {
		try {
			const user = await User.findById(req.user.id).select('-password')

			if (!user)
				return res.status(400).json({ message: 'Tài khoản không tồn tại' })

			res.status(200).json({ user })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	addCart: async (req, res) => {
		try {
			const user = await User.findById(req.user.id)
			if (!user)
				return res.status(404).json({ message: 'Tài khoản không tồn tại' })
			await User.findOneAndUpdate({ _id: req.user.id }, { cart: req.body.cart })
			return res.status(200).json({ message: 'Thêm vào giỏ hàng thành công' })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
}

const createAccessToken = (user) => {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

const createRefreshToken = (user) => {
	return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userController
