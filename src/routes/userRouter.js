const router = require('express').Router()
// Controller
const userController = require('../controllers/userController')

// Auth Middleware
const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

// Đăng ký
router.post('/register', userController.register)
// Đăng nhập
router.post('/login', userController.login)
// Đăng nhập với Facebook
router.post('/loginwithfacebook', userController.loginWithFacebook)
// Đăng xuất
router.get('/logout', userController.logout)
// Làm mới Token
router.get('/refresh_token', userController.refreshToken)
// Thông tin user
router.get('/info', auth, userController.info)
// Giỏ hàng
router.patch('/addcart', auth, userController.addCart)
// Các đơn hàng
router.patch('/order', auth, userController.order)

// admin get all user
router.get('/all', auth, authAdmin, userController.getAllUsers)

module.exports = router
