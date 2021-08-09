const router = require('express').Router()
// Controller
const userController = require('../controllers/userController')

// Auth Middleware
const auth = require('../middlewares/auth')

// Đăng ký
router.post('/register', userController.register)
// Đăng nhập
router.post('/login', userController.login)
// Đăng xuất
router.get('/logout', userController.logout)
// Làm mới Token
router.get('/refresh_token', userController.refreshToken)
// Thông tin user
router.get('/info', auth, userController.info)

router.patch('/addcart', auth, userController.addCart)

module.exports = router
