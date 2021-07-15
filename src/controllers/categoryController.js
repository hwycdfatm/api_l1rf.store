// CATEGORY
const Category = require('../models/categoryModel')

const categoryController = {
	// lấy danh mục
	getCategory: async (req, res) => {
		try {
			const categories = await Category.find()

			res.status(200).json({ status: 'Success', categories })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	getCategoryBySlug: async (req, res) => {
		try {
			const categories = await Category.findOne({ slug: req.params.slug })
			if (!categories)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Không tìm thấy' })
			res.status(200).json({ status: 'Success', categories })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	// Tạo mới danh mục
	createCategory: async (req, res) => {
		try {
			const { name, image, path } = req.body

			const category = await Category.findOne({ name })

			if (category)
				return res.status(400).json({ message: 'Danh mục đã tồn tại' })

			const newCategory = new Category({ name, image, path })

			await newCategory.save()

			res
				.status(200)
				.json({ status: 'Success', message: 'Tạo danh mục thành công' })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	updateCategory: async (req, res) => {},
	deleteCategory: async (req, res) => {
		try {
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
}

module.exports = categoryController
