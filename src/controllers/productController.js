const Product = require('../models/productModel')

const productController = {
	// lấy sản phẩm với slug EX: /product/l1rf-tee-shirt-ultimate
	getProduct: async (req, res) => {
		try {
			const product = await Product.findOne({ slug: req.slug })
			if (!product)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Không tìm thấy sản phẩm' })
			res.status(200).json({ status: 'Success', message: product })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	createProduct: async (req, res) => {
		try {
			res.json('Product Create')
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	updateProduct: async (req, res) => {
		try {
			res.json('Product Update')
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	deleteProduct: async (req, res) => {
		try {
			res.json('Product Delete')
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
}

module.exports = productController
