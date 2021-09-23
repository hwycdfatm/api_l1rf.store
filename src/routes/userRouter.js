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
// Cập nhật thông tin user
router.put('/info', auth, userController.updateProfile)
// Giỏ hàng
router.patch('/addcart', auth, userController.addCart)

// admin get all user
router.get('/all', auth, authAdmin, userController.getAllUsers)
// admin route cập nhật khóa tài khoản hoặc thay đổi quyền cho user
router.patch('/:id', auth, authAdmin, userController.updateByAdmin)

module.exports = router
