const router = require('express').Router()
const uploadController = require('../controllers/uploadController')
const authAdmin = require('../middlewares/authAdmin')
const auth = require('../middlewares/auth')

const uploadImage = require('../utils/uploadImage')

router.post('/upload', auth, authAdmin, uploadImage, uploadController.upload)

router.post('/destroy/:public_name', auth, authAdmin, uploadController.destroy)
router.post(
	'/destroy-array',
	auth,
	authAdmin,
	uploadController.destroyArrayImage
)

module.exports = router
