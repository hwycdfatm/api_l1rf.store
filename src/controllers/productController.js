const Product = require('../models/productModel')
const { unlink } = require('fs').promises

const string_to_slug = require('../utils/stringToSlug')

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

	getProductById: async (req, res) => {
		try {
			const product = await Product.findOne({ _id: req.params.id })

			if (!product)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Không tìm thấy sản phẩm' })

			res.status(200).json({ status: 'Success', data: product })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},

	getProductDeleted: async (req, res) => {
		try {
			// Filter by category
			const category = req.query.category

			// Pagination
			const _limit = parseInt(req.query._limit) || 9
			const _page = parseInt(req.query._page) || 1
			const _skip = (_page - 1) * _limit

			const sort = req.query.sort || '-createdAt'

			const products = await Product.findDeleted(category ? { category } : {})
				.limit(_limit)
				.skip(_skip)
				.sort(sort)

			const _total_Product = await Product.countDocumentsDeleted(
				category ? { category } : {}
			)
			const _total_Page = Math.ceil(_total_Product / _limit)

			return res.status(200).json({
				status: 'Success',
				pagination: { _page, _total_Page, _total_Product },
				data: products,
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},

	// [GET] /api/product?category=????
	getProducts: async (req, res) => {
		try {
			// Filter by category
			const category = req.query.category
			// Query search
			const search = req.query.q
			// Query sort
			const sort = req.query.sort || '-createdAt'
			// Init products array :v
			let products = []
			// Limit product on page
			const _limit = parseInt(req.query._limit) || 9
			const _total_Product = await Product.countDocuments(
				category ? { category } : {}
			)
			// Total Page Of Category
			const _total_Page = Math.ceil(_total_Product / _limit)

			// Pagination
			const _page =
				parseInt(req.query._page) < 1
					? 1
					: parseInt(req.query._page) > _total_Page
					? _total_Page
					: parseInt(req.query._page) || 1

			const _skip = (_page - 1) * _limit

			if (search) {
				const searchQuery = string_to_slug(search)
				products = await Product.find({
					slug: { $regex: new RegExp('^' + searchQuery) },
				})
					.limit(_limit)
					.skip(_skip)
					.sort(sort)
			} else {
				if (_total_Product > 0) {
					products = await Product.find(category ? { category } : {})
						.limit(_limit)
						.skip(_skip)
						.sort(sort)
				} else {
					products = await Product.find(category ? { category } : {}).sort(sort)
				}
			}

			return res.status(200).json({
				status: 'Success',
				pagination: { _page, _total_Page, _total_Product },
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
			const { title, description, content, images, category, price, inStock } =
				req.body

			const slug = string_to_slug(title)

			const product = await Product.findOne({ slug })

			if (product)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Sản phẩm đã tồn tại' })

			if (inStock <= 0)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Vui lòng nhập số lượng hợp lệ' })

			const newProduct = new Product({
				title,
				description,
				content,
				images,
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
				images,
				category,
				slug,
				price,
				inStock,
				size,
			} = req.body

			if (inStock < 0)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Vui lòng nhập số lượng hợp lệ' })

			const product = await Product.findByIdAndUpdate(id, {
				title,
				description,
				content,
				images,
				category,
				slug,
				price,
				inStock,
				size,
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

	// restore
	restoreProduct: async (req, res) => {
		try {
			const _id = req.params.id
			const result = await Product.restore({ _id })

			if (!result)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Có lỗi xảy ra' })
			return res
				.status(200)
				.json({ status: 'Success', message: 'Khôi phục sản phẩm thành công' })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	// Xóa sản phẩm
	// [DELETE] /api/product/:id
	deleteProduct: async (req, res) => {
		try {
			const id = req.params.id
			const product = await Product.deleteById(id)
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
	deleteProductDeleted: async (req, res) => {
		try {
			const id = req.params.id
			const { images } = await Product.findOneDeleted({ _id: id })

			if (images) {
				for (let image of images) {
					await unlink(`./uploads/${image.public_name}`)
				}
			}
			const product = await Product.deleteOne({ _id: id })

			if (!product)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Có lỗi xảy ra' })
			return res.status(200).json({
				status: 'Success',
				message: 'Đã xóa vĩnh viền sản phẩm thành công',
			})
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
}

module.exports = productController
