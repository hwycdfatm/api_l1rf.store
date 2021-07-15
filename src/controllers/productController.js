const Product = require('../models/productModel')

const productController = {
	getProduct: async (req, res) => {
		try {
			const product = await Product.findOne({ slug: req.slug })
			if (!product)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Product not found' })
			res.status(200).json({ status: 'Success', message: product })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	createProduct: async (req, res) => {},
	updateProduct: async (req, res) => {},
	deleteProduct: async (req, res) => {},
}

module.exports = productController
