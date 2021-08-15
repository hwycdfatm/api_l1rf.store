const router = require('express').Router()
const fs = require('fs')

const {
	uploadCloudinary,
	removeCloudinary,
} = require('../helper/cloudinaryHelper')
const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

// middleware handle check file image
function checkFile(file) {
	if (file.size > 1024 * 1024 * 1024) {
		removeTempFile(file.tempFilePath)
		return {
			status: false,
			message: 'Kích thước file quá lớn (<3MB)',
		}
	}
	if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
		removeTempFile(file.tempFilePath)
		return {
			status: false,
			message: 'Định dạng hình ảnh không hợp lệ',
		}
	}
	return {
		status: true,
		message: 'Chấp nhận',
	}
}

// [POST] /api/upload == body is object or 1 file
router.post('/upload', auth, authAdmin, async (req, res) => {
	try {
		const images = []
		if (!req.files || Object.keys(req.files).length === 0)
			return res.status(400).json({ message: 'Vui lòng chọn hình ảnh' })
		const files = req.files.file
		if (files.length > 1) {
			for (let file of files) {
				const check = checkFile(file)
				if (!check.status)
					return res.status(400).json({ status: 'Lỗi', message: check.message })
				const temp = await uploadCloudinary(file)
				removeTempFile(file.tempFilePath)
				images.push(temp)
			}
			return res.status(200).json({ images })
		}
		const check = checkFile(files)
		if (!check.status)
			return res.status(400).json({ status: 'Lỗi', message: check.message })
		const tempImage = await uploadCloudinary(files)
		removeTempFile(files.tempFilePath)
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

// [POST] /api/destroy === body is array
router.post('/destroy', auth, authAdmin, async (req, res) => {
	try {
		const { public_id } = req.body

		if (!public_id || public_id.length === 0)
			return res.status(400).json({ message: 'Không có ảnh nào để mà xóa' })
		const ids = [...public_id]

		const check = await removeCloudinary(ids)

		if (check) return res.status(200).json({ message: 'Xóa ảnh thành công' })
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
