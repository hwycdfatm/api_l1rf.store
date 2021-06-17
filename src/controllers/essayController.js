const Essay = require('../models/essayModel')

class EssayController {
	async get(req, res) {
		try {
			const essay = await Essay.find()
			if (!essay) res.status(400).json({ message: 'Không có bài viết nào' })
			res.status(200).json({ status: 'Success', data: essay })
		} catch (error) {
			res.status(500).json({ message: 'Lỗi server', error })
		}
	}

	async getOneById(req, res) {
		try {
			const id = req.params.id
			const essay = await Essay.findOne({ _id: id })
			if (!essay) res.status(400).json({ message: 'Không có bài viết nào' })
			res.status(200).json({ status: 'Success', data: essay })
		} catch (error) {
			res.status(500).json({ message: 'Lỗi Server', error })
		}
	}

	async create(req, res) {
		const essay = new Essay(req.body)
		try {
			const status = await essay.save()
			if (!status) res.status(400).json({ message: 'Không thể tạo bài viết' })
			res.status(200).json({ status: 'Success' })
		} catch (error) {
			res.status(500).json({ message: 'Lỗi Server', error })
		}
	}

	async update(req, res) {
		const id = req.params.id
		const data = req.body
		try {
			const status = await Essay.updateOne({ _id: id }, data)
			if (!status)
				res.status(400).json({ message: 'Không thể cập nhật bài viết' })
			res.status(200).json({ message: 'Cập nhật bài viết thành công' })
		} catch (error) {
			res.status(500).json({ message: 'Lỗi Server', error })
		}
	}

	async delete(req, res) {
		try {
			const id = req.params.id
			const status = await Essay.findByIdAndRemove(id)
			if (!status) res.status(400).json({ message: 'Không thể xóa bài viết' })
			res.status(200).json({ message: 'Xóa bài viết thành công' })
		} catch (error) {
			res.status(500).json({ message: 'Lỗi Server', error })
		}
	}
}

module.exports = new EssayController()
