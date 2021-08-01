const Product = require('../models/productModel')

// Phân trang, các bộ lọc, blalala
class APIfeatures {
	constructor(query, queryString) {
		this.query = query
		this.queryString = queryString
	}
	filtering() {
		const queryObj = { ...this.queryString } //queryString = req.query

		const excludedFields = ['page', 'sort', 'limit']
		excludedFields.forEach((el) => delete queryObj[el])

		let queryStr = JSON.stringify(queryObj)
		queryStr = queryStr.replace(
			/\b(gte|gt|lt|lte|regex)\b/g,
			(match) => '$' + match
		)

		//    gte = greater than or equal
		//    lte = lesser than or equal
		//    lt = lesser than
		//    gt = greater than
		this.query.find(JSON.parse(queryStr))

		return this
	}
	sorting() {
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(',').join(' ')
			this.query = this.query.sort(sortBy)
		} else {
			this.query = this.query.sort('-createdAt')
		}

		return this
	}
	paginating() {
		const page = this.queryString.page * 1 || 1
		const limit = this.queryString.limit * 1 || 3
		const skip = (page - 1) * limit
		this.query = this.query.skip(skip).limit(limit)
		return this
	}
}
const productController = {
	// lấy sản phẩm với slug EX: /product/l1rf-tee-shirt-ultimate
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
	getProducts: async (req, res) => {
		try {
			const features = new APIfeatures(Product.find(), req.query)
				.filtering()
				.sorting()
				.paginating()

			const products = await features.query
			return res
				.status(200)
				.json({ status: 'success', result: products.length, data: products })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
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
