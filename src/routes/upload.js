const router = require('express').Router()
const cloudinary = require('cloudinary')
const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
})

router.post('/upload', (req, res) => {
	try {
		console.log(req.files)
		if (!req.files || Object.keys(req.files).length === 0)
			return res.status(400).json({ message: 'Vui lòng chọn hình ảnh' })

		const file = req.files.file
		console.log(file)
		if (file.size > 1024 * 1024 * 1024)
			return res
				.status(400)
				.json({ message: 'Kích thước hình ảnh quá lớn (3Mb)' })

		if (file.mimetype !== 'image/png')
			return res
				.status(400)
				.json({ message: 'Định dạng hình ảnh không hợp lệ' })

		cloudinary.v2.uploader.upload(
			file,
			{ folder: 'test' },
			async (error, results) => {
				if (error) throw error
				res.json({ results })
			}
		)
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
})

module.exports = router
