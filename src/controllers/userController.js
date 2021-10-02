const User = require('../models/userModel')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const fetch = require('node-fetch')

const userController = {
	register: async (req, res) => {
		try {
			const { name, email, password, address, phone } = req.body

			const user = await User.findOne({ email })
			if (user)
				return res
					.status(400)
					.json({ status: 'Failed', message: 'Email đã được đăng ký.' })

			if (password.length < 6)
				return res
					.status(400)
					.json({ status: 'Failed', message: 'Mật khẩu tối thiểu 6 ký tự' })

			// Hash Password
			const passwordHash = await bcrypt.hash(password, 10)
			const newUser = new User({
				name,
				email,
				address,
				phone,
				password: passwordHash,
			})

			// Lưu vào database
			await newUser.save()

			// Tạo ACCESS TOKEN
			const accessToken = createAccessToken({ id: newUser._id })
			const refreshToken = createRefreshToken({ id: newUser._id })

			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				path: '/api/user/refresh_token',
				maxAge: 7 * 24 * 60 * 60 * 1000,
				sameSite: 'none',
				secure: true,
			})

			res.json({
				status: 'Success',
				message: 'Đăng ký thành công',
				accessToken,
			})
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
					.json({ status: 'Fail', message: 'Thông tin đăng nhập không hợp lệ' })

			const mathPassword = await bcrypt.compare(password, user.password)

			if (!mathPassword)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Thông tin đăng nhập không hợp lệ' })

			if (!user.activate)
				return res.status(400).json({
					status: 'Fail',
					message: 'Tài khoản bạn đã bị khóa',
				})

			// Tạo ACCESS TOKEN
			const accessToken = createAccessToken({ id: user._id })
			const refreshToken = createRefreshToken({ id: user._id })

			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				path: '/api/user/refresh_token',
				maxAge: 7 * 24 * 60 * 60 * 1000,
				sameSite: 'none',
				secure: true,
			})

			return res.status(200).json({
				status: 'Success',
				message: 'Đăng nhập thành công',
				accessToken,
			})
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},
	loginWithFacebook: async (req, res) => {
		try {
			const { userID, accessToken } = req.body

			let urlGraph = `https://graph.facebook.com/v11.0/${userID}?fields=name%2Cemail%2Cpicture&access_token=${accessToken}`

			const data = await fetch(urlGraph, {
				method: 'GET',
			})
			const result = await data.json()

			const { email, name, picture } = result

			const user = await User.findOne({ email })

			// Nếu tồn tại email thì đăng nhập và trả về token
			if (user) {
				const accessToken = createAccessToken({ id: user._id })
				const refreshToken = createRefreshToken({ id: user._id })

				res.cookie('refreshToken', refreshToken, {
					httpOnly: true,
					path: '/api/user/refresh_token',
					maxAge: 7 * 24 * 60 * 60 * 1000,
					sameSite: 'none',
					secure: true,
				})

				return res.status(200).json({
					status: 'Success',
					message: 'Đăng nhập thành công',
					accessToken,
				})
			} else {
				// Nếu chưa đăng nhập hoặc gì đó thì sẽ tự động đăng ký và tự đăng nhập luôn
				const password = `${email}toanndz${name}ihnuey${process.env.CLOUD_API_SECRET}`
				const avatar = picture.url
				const passwordHash = await bcrypt.hash(password, 10)
				const newUser = new User({
					name,
					email,
					avatar,
					password: passwordHash,
				})
				// Lưu vào database
				await newUser.save()

				const accessToken = createAccessToken({ id: newUser._id })
				const refreshToken = createRefreshToken({ id: newUser._id })

				res.cookie('refreshToken', refreshToken, {
					httpOnly: true,
					path: '/api/user/refresh_token',
					maxAge: 7 * 24 * 60 * 60 * 1000,
					sameSite: 'none',
					secure: true,
				})

				return res.status(200).json({
					status: 'Success',
					message: 'Đăng nhập thành công',
					accessToken,
				})
			}
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},
	logout: async (req, res) => {
		try {
			res.clearCookie('refreshToken', { path: '/api/user/refresh_token' })
			return res
				.status(200)
				.json({ status: 'Success', message: 'Đăng xuất thành công!' })
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},
	refreshToken: (req, res) => {
		try {
			const refreshToken = req.cookies.refreshToken
			if (!refreshToken)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Vui lòng đăng nhập hoặc đăng ký' })
			jwt.verify(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET,
				(error, user) => {
					if (error)
						return res.status(419).json({
							status: 'Fail',
							message: 'Vui lòng đăng nhập hoặc đăng ký',
						})
					const accessToken = createAccessToken({ id: user.id })
					res.json({ user, accessToken })
				}
			)
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},
	info: async (req, res) => {
		try {
			const user = await User.findById(req.user.id).select('-password')

			if (!user)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Tài khoản không tồn tại' })

			return res.status(200).json({ user })
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},
	updateProfile: async (req, res) => {
		try {
			const { name, password, address, phone } = req.body

			const resultUpdateUser = await User.findByIdAndUpdate(req.user.id, {
				name,
				password,
				address,
				phone,
			})
			if (!resultUpdateUser)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Có lỗi xảy ra rồi' })

			return res
				.status(200)
				.json({ status: 'Success', message: 'Cập nhật thông tin thành công' })
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},
	addCart: async (req, res) => {
		try {
			const user = await User.findById(req.user.id)
			if (!user)
				return res
					.status(404)
					.json({ status: 'Fail', message: 'Tài khoản không tồn tại' })

			const { cart } = req.body
			const removeKeyObj = [
				'description',
				'content',
				'sold',
				'inStock',
				'createdAt',
				'deletedAt',
				'deleted',
				'updatedAt',
			]
			const cartTemp = []
			for (item of cart) {
				removeKeyObj.forEach((key) => delete item[key])
				cartTemp.push(item)
			}
			for (item of cart) {
			}
			await User.findOneAndUpdate({ _id: req.user.id }, { cart: cartTemp })
			return res.status(200).json({
				status: 'Success',
				message: 'Thêm vào giỏ hàng thành công',
				cart,
			})
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},

	// Admin route
	updateByAdmin: async (req, res) => {
		try {
			const _id = req.params.id
			const { role, activate } = req.body
			console.log({ role, activate })
			const result = await User.findByIdAndUpdate(_id, { role, activate })

			if (!result)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Có lỗi xảy ra' })
			return res.status(200).json({
				status: 'Success',
				message: 'Cập nhật thông tin thành công',
			})
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},
	getAllUsers: async (req, res) => {
		try {
			const sort = req.query.sort || '-createdAt'
			const _limit = parseInt(req.query._limit) || 100
			const allUsers = await User.find()
				.sort(sort)
				.limit(_limit)
				.select('-password')
			if (allUsers.length == 0)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Không có user nào' })
			return res.status(200).json({ users: allUsers })
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},

	getAllUsersDeleted: async (req, res) => {
		try {
			const sort = req.query.sort || '-createdAt'
			const _limit = parseInt(req.query._limit) || 100
			const allUsers = await User.findDeleted()
				.sort(sort)
				.limit(_limit)
				.select('-password')
			if (allUsers.length == 0)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Không có user nào' })
			return res.status(200).json({ users: allUsers })
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},

	restoreUser: async (req, res) => {
		try {
			const _id = req.params.id
			if (!_id)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Không có user nào được chọn' })

			const user = await User.restore({ _id })
			if (!user)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Có lỗi xảy ra' })
			return res
				.status(200)
				.json({ status: 'Success', message: 'Khôi phục thành công' })
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},

	deleteUser: async (req, res) => {
		try {
			const _id = req.params.id
			if (!_id)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Không có user nào được chọn' })

			const user = await User.deleteById(_id)
			if (!user)
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

	deleteForceUser: async (req, res) => {
		try {
			const _id = req.params.id
			if (!_id)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Không có user nào được chọn' })

			const user = await User.deleteOne({ _id })
			if (!user)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Có lỗi xảy ra' })
			return res.status(200).json({
				status: 'Success',
				message: 'Đã xóa vĩnh viễn user thành công',
			})
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},
}

const createAccessToken = (user) => {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '11m' })
}

const createRefreshToken = (user) => {
	return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userController
