const router = require('express').Router()
const fs = require('fs')
const cloudinary = require('cloudinary')
const uploadCloudinary = require('../middlewares/uploadCloudinary')
const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
})

router.post('/upload', auth, authAdmin, async (req, res) => {
	try {
		const images = []
		if (!req.files || Object.keys(req.files).length === 0)
			return res.status(400).json({ message: 'Vui lòng chọn hình ảnh' })
		const files = req.files.file
		if (files.length > 1) {
			for (let file of files) {
				if (file.size > 1024 * 1024 * 1024) {
					return res
						.status(400)
						.json({ message: 'Kích thước hình ảnh quá lớn (3Mb)' })
				}
				if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
					return res
						.status(400)
						.json({ message: 'Định dạng hình ảnh không hợp lệ' })
				}
				const temp = await uploadCloudinary(file)
				images.push(temp)
			}
			return res.status(200).json({ images })
		}

		if (files.size > 1024 * 1024 * 1024) {
			removeTempFile(files.tempFilePath)
			return res
				.status(400)
				.json({ message: 'Kích thước hình ảnh quá lớn (3Mb)' })
		}

		if (files.mimetype !== 'image/png' && files.mimetype !== 'image/jpeg') {
			removeTempFile(file.tempFilePath)
			return res
				.status(400)
				.json({ message: 'Định dạng hình ảnh không hợp lệ' })
		}
		const tempImage = await uploadCloudinary(files)
		if (tempImage)
			return res
				.status(200)
				.json({ public_id: tempImage.public_id, url: tempImage.secure_url })
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
})

//--------------------------------------------------- handle upload multiple images --------------------
// router.post('/upload-images', auth, authAdmin, (req, res) => {
// 	try {
// 		if (!req.files || Object.keys(req.files).length === 0)
// 			return res.status(400).json({ message: 'Vui lòng chọn hình ảnh' })

// 		const file = req.files.file
// 		if (file.size > 1024 * 1024 * 1024) {
// 			removeTempFile(file.tempFilePath)
// 			return res
// 				.status(400)
// 				.json({ message: 'Kích thước hình ảnh quá lớn (3Mb)' })
// 		}

// 		if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
// 			removeTempFile(file.tempFilePath)
// 			return res
// 				.status(400)
// 				.json({ message: 'Định dạng hình ảnh không hợp lệ' })
// 		}

// 		cloudinary.v2.uploader.upload(
// 			file.tempFilePath,
// 			{ folder: process.env.FOLDER_NAME },
// 			async (error, results) => {
// 				if (error) throw error
// 				console.log(file.tempFilePath)
// 				removeTempFile(file.tempFilePath)
// 				return res
// 					.status(200)
// 					.json({ public_id: results.public_id, url: results.secure_url })
// 			}
// 		)
// 	} catch (error) {
// 		return res.status(500).json({ message: error.message })
// 	}
// })

router.post('/destroy', auth, authAdmin, (req, res) => {
	try {
		const { public_id } = req.body
		if (!public_id)
			return res.status(400).json({ message: 'Không có ảnh nào để mà xóa' })

		cloudinary.v2.uploader.destroy(public_id, async (error) => {
			if (error) throw error
			res.status(200).json({ message: 'Xóa ảnh thành công' })
		})
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
})

const removeTempFile = (path) => {
	fs.unlink(path, (err) => {
		if (err) throw err
	})
}

module.exports = router
