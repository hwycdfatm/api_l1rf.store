const Essay = require('../models/essayModel')

class EssayController {
	get(req, res) {
		Essay.find()
			.then((essay) => {
				res.status(200).json(essay)
			})
			.catch((err) => {
				res.status(500).json({ message: 'Không tìm thấy bài văn nào' })
			})
	}

	getOneById(req, res) {
		Essay.findOne({ _id: req.params.id })
			.then((essay) => {
				res.status(200).json(essay)
			})
			.catch((err) => {
				res.status(500).json({ message: 'Không tìm thấy bài văn nào' })
			})
	}

	create(req, res) {
		const essay = new Essay(req.body)
		essay
			.save()
			.then(() => {
				res.status(200).json({ message: 'Tạo bài viết thành công' })
			})
			.catch((err) => {
				res.status(500).json({ message: 'Không thể tạo bài viết' })
			})
	}

	update(req, res) {
		const id = req.params.id
		const data = req.body
		Essay.updateOne({ _id: id }, data)
			.then(() => {
				res.status(200).json({ message: 'Cập nhật bài viết thành công' })
			})
			.catch((error) => {
				res.status(500).json({ message: 'Không thể cập nhật bài viết' })
			})
	}

	delete(req, res) {
		Essay.findByIdAndDelete(req.params.id)
			.then(res.status(200).json({ message: 'Xóa bài viết thành công' }))
			.catch((err) => {
				res.status(500).json({ message: 'Không thể xóa bài viết' })
			})
	}
}

module.exports = new EssayController()
