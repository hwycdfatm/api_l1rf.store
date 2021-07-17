// CATEGORY
const Category = require('../models/categoryModel')

const categoryController = {
	// lấy danh mục
	getCategory: async (req, res) => {
		try {
			const categories = await Category.find()

			res.status(200).json({ status: 'Success', data: categories })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	// lấy danh mục từ slug EX: /category/pants
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
			const { name, image, slug } = req.body

			const category = await Category.findOne({ name })

			if (category)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Danh mục đã tồn tại' })

			const newCategory = new Category({ name, image, slug })

			await newCategory.save()

			res
				.status(200)
				.json({ status: 'Success', message: 'Tạo danh mục thành công' })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	// chỉnh sửa danh mục
	updateCategory: async (req, res) => {
		try {
			const id = req.params.id
			const { name, image, slug } = req.body
			const category = await Category.findOneAndUpdate(id, {
				name,
				image,
				slug,
			})
			if (!category)
				return res
					.status(400)
					.json({ status: 'Fail', message: 'Có lỗi xảy ra' })
			return res
				.status(200)
				.json({ status: 'Success', message: 'Cập nhật thành công' })
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
	// xóa danh mục
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
			return res.status(500).json({ message: error.message })
		}
	},
}

module.exports = categoryController
