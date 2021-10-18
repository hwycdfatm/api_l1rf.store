// CATEGORY
const Category = require('../models/categoryModel')
const string_to_slug = require('../utils/stringToSlug')

const categoryController = {
	// lấy danh mục
	// [GET] /api/category/
	getCategories: async (req, res) => {
		try {
			const categories = await Category.find()
			if (!categories)
				return res
					.status(404)
					.json({ status: 'Fail', message: 'Có lỗi xảy ra!' })
			return res.status(200).json({ status: 'Success', data: categories })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},

	// Tạo mới danh mục
	// [POST] /api/category
	createCategory: async (req, res) => {
		try {
			const { name } = req.body

			const category = await Category.findOne({ name })

			if (category)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Danh mục đã tồn tại' })

			const slug = string_to_slug(name)
			const newCategory = new Category({ name, slug })

			await newCategory.save()

			res
				.status(200)
				.json({ status: 'Success', message: 'Tạo danh mục thành công' })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},

	// xóa danh mục
	// [DELETE] /api/category/:id
	deleteCategory: async (req, res) => {
		try {
			const id = req.params.id
			const category = await Category.findByIdAndRemove(id)
			if (!category)
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
}

module.exports = categoryController
