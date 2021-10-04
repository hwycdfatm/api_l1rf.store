const Payment = require('../models/paymentModel')

const PaymentController = {
	// lấy tất cả các hóa đơn
	getAllPayments: async (req, res) => {
		try {
			const result = await Payment.find().sort('-createdAt')
			const total = result.reduce((pre, cur) => {
				return pre + cur.total
			}, 0)
			return res.status(200).json({
				status: 'Success',
				order: result,
				length: result.length,
				total,
			})
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},
	getAllPaymentsDeleted: async (req, res) => {
		try {
			const result = await Payment.findDeleted().sort('-createdAt')
			return res
				.status(200)
				.json({ status: 'Success', order: result, length: result.length })
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},

	// Lây hóa đơn theo userID
	getPayments: async (req, res) => {
		try {
			const { id } = req.user
			const result = await Payment.find({ user_ID: id })
			return res
				.status(200)
				.json({ status: 'Success', order: result, length: result.length })
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},

	// Tạo mới hóa đơn
	createPayment: async (req, res) => {
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
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},

	// Cập nhật hóa đơn
	updatePayment: async (req, res) => {
		try {
			const _id = req.params.id
			const { status } = req.body
			if (!_id)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Không có đơn hàng nào được chọn' })
			await Payment.updateOne({ _id }, { status })
			return res.status(200).json({
				status: 'Success',
				message: 'Cập nhật trạng thái đơn hàng thành công',
			})
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},

	deletePayment: async (req, res) => {
		try {
			const _id = req.params.id
			if (!_id)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Không có đơn hàng nào được chọn' })

			const payment = await Payment.deleteById(_id)
			if (!payment)
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

	deleteForcePayment: async (req, res) => {
		try {
			const _id = req.params.id
			if (!_id)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Không có đơn hàng nào được chọn' })

			const payment = await Payment.deleteOne({ _id })
			if (!payment)
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

	restorePayment: async (req, res) => {
		try {
			const _id = req.params.id
			const result = await Payment.restore({ _id })

			if (!result)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Có lỗi xảy ra' })
			return res
				.status(200)
				.json({ status: 'Success', message: 'Khôi phục đơn hàng thành công' })
		} catch (error) {
			return res.status(500).json({ status: 'Fail', message: error.message })
		}
	},
}

module.exports = PaymentController
