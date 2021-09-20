const Payment = require('../models/paymentModel')

const PaymentController = {
	// lấy tất cả các hóa đơn
	getAllPayments: async (req, res) => {
		try {
			const result = await Payment.find()
			const total = result.reduce((pre, cur) => {
				return pre + cur.total
			}, 0)
			return res
				.status(200)
				.json({ order: result, length: result.length, total })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	// Lây hóa đơn theo userID
	getPayments: async (req, res) => {
		try {
			const { id } = req.user
			const result = await Payment.find({ user_ID: id })
			return res.status(200).json({ order: result, length: result.length })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	// Tạo mới hóa đơn
	creatPayment: async (req, res) => {
		try {
			const { order, user, total, method, paid, quantity } = req.body
			if (order.length < 1)
				return res
					.status(400)
					.json({ status: 'Failed', message: 'Giỏ hàng bạn đang trống' })
			if (!user.address)
				return res.status(400).json({
					status: 'Failed',
					message: 'Vui lòng cập nhật địa chỉ giao hàng trước',
				})

			const { _id, address, email, name, phone } = user
			const paymentID = Math.floor(Math.random() * (Date.now() / 10000000))
			const newPayment = new Payment({
				user_ID: _id,
				name,
				total,
				phone,
				address,
				email,
				order,
				status: paid,
				quantity,
				paymentID,
				method: method || 'COD',
			})
			await newPayment.save()
			return res
				.status(200)
				.json({ status: 'Success', message: 'Đặt hàng thành công' })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	// Cập nhật hóa đơn
	updatePayment: async (req, res) => {
		try {
			return res.status(200).json('Hello')
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
}

module.exports = PaymentController
