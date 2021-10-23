const router = require('express').Router()
const assectController = require('../controllers/assectController')

const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

router.get('/', assectController.get)
router.put('/:id', auth, authAdmin, assectController.update)

module.exports = router
