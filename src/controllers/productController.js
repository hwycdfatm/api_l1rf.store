const Product = require('../models/productModel')

const productController = {
	// lấy sản phẩm với slug
	// [GET] /api/product/:slug
	getProduct: async (req, res) => {
		try {
			const product = await Product.findOne({ slug: req.params.slug })

			if (!product)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Không tìm thấy sản phẩm' })

			res.status(200).json({ status: 'Success', data: product })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},

	// Lấy các sản phẩm thuộc nhóm danh mục nào
	// [GET] /api/product?category=????
	getProducts: async (req, res) => {
		try {
			const { category, _page, _limit, _sort, _method } = req.query

			const limit = _limit || 9
			const page = _page || 1

			const products = await Product.find()
			const total = await Product.countDocuments()

			return res.status(200).json({
				status: 'success',
				pagination: { page, limit, total },
				data: products,
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},

	// Tạo mới sản phẩm
	// [POST] /api/product/
	createProduct: async (req, res) => {
		try {
			const {
				title,
				description,
				content,
				image,
				category,
				slug,
				price,
				inStock,
			} = req.body

			const product = await Product.findOne({ slug })

			if (product)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Sản phẩm đã tồn tại' })

			const newProduct = new Product({
				title,
				description,
				content,
				image,
				category,
				slug,
				price,
				inStock,
			})
			await newProduct.save()
			res
				.status(200)
				.json({ status: 'Success', message: 'Tạo sản phẩm thành công' })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},

	// Cập nhật sản phẩm
	// [PUT] /api/product/:id
	updateProduct: async (req, res) => {
		try {
			const id = req.params.id
			const {
				title,
				description,
				content,
				image,
				category,
				slug,
				price,
				inStock,
			} = req.body

			// Hiện tại đang có lỗi với trường hợp này và đợi xử lý sau
			const product = await Product.findByIdAndUpdate(id, {
				title,
				description,
				content,
				image,
				category,
				slug,
				price,
				inStock,
			})

			if (!product)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Có lỗi xảy ra' })
			return res
				.status(200)
				.json({ status: 'Success', message: 'Cập nhật sản phẩm thành công' })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},

	// Xóa sản phẩm
	// [DELETE] /api/product/:id
	deleteProduct: async (req, res) => {
		try {
			const id = req.params.id
			const product = await Product.findByIdAndRemove(id)
			if (!product)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Có lỗi xảy ra' })
			return res
				.status(200)
				.json({ status: 'Success', message: 'Xóa thành công' })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
}

module.exports = productController
