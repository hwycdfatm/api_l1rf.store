// CATEGORY
const Category = require('../models/categoryModel')

const categoryController = {
	// lấy danh mục
	getCategory: async (req, res) => {
		try {
			const categories = await Category.find()

			res.json(categories)
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

			res.status(200).json({ message: 'Tạo danh mục thành công' })
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
