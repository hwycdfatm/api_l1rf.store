const router = require('express').Router()
const uploadController = require('../controllers/uploadController')
const authAdmin = require('../middlewares/authAdmin')
const auth = require('../middlewares/auth')
const multer = require('multer')
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './uploads')
	},
	filename: (req, file, cb) => {
		cb(null, Date.now().toString() + file.originalname)
	},
})

const uploadImage = (req, res, next) => {
	const maxSize = 1024 * 1024 * 3 // images max size is 3 MB
	const upload = multer({
		storage,
		limits: { fileSize: maxSize },
		fileFilter: (req, file, cb) => {
			if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
				return cb(null, false)
			}
			cb(null, true)
		},
	}).array('images', 5)
	upload(req, res, function (err) {
		if (err) {
			return res.status(400).json({
				message:
					'Có lỗi xảy ra, định dạng ảnh không hợp lệ hoặc kích thước ảnh quá lớn (>3MB)',
			})
		}
		next()
	})
}

router.post('/upload', auth, authAdmin, uploadImage, uploadController.upload)

// [POST] body is array
router.post('/destroy', auth, authAdmin, uploadController.destroy)

module.exports = router
