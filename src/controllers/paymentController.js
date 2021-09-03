const Payment = require('../models/paymentModel')

const PaymentController = {
	// lấy tất cả các hóa đơn
	getAllPayments: async (req, res) => {
		try {
			return res.status(200).json('Hello')
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	// Lây hóa đơn theo id
	getPayment: async (req, res) => {
		try {
			return res.status(200).json('Hello')
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	// Tạo mới hóa đơn
	creatPayment: async (req, res) => {
		try {
			const { order, user, total } = req.body
			return res.status(200).json('Hello')
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
