const router = require('express').Router()
const tokenController = require('../controllers/tokenController')
const auth = require('../middlewares/auth')

router.get('/', auth, tokenController.checkToken)

module.exports = router
