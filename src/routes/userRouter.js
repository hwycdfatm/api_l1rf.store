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
// Quên mật khẩu
router.post('/forgot-password', userController.forgotPassword)
// Thay đổi mật khẩu
router.post('/change-password', auth, userController.changePassword)
// Reset Passsword
router.post('/reset-password', auth, userController.resetPassword)
// Đăng nhập với Facebook
router.post('/loginwithsocial', userController.loginWithSocial)
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

router.patch('/removecart', auth, userController.removeCart)

router.patch('/update-cart', auth, userController.updateCart)

// admin get all user
router.get('/all', auth, authAdmin, userController.getAllUsers)
// admin get all user deleted
router.get('/all-deleted', auth, authAdmin, userController.getAllUsersDeleted)
// admin route cập nhật khóa tài khoản hoặc thay đổi quyền cho user
router.patch('/:id', auth, authAdmin, userController.updateByAdmin)
// admin khôi phục tài khoản
router.patch('/:id/restore', auth, authAdmin, userController.restoreUser)
// admin xóa mền tài khoản
router.delete('/:id', auth, authAdmin, userController.deleteUser)
// admin xóa thẳng cẳng thằng user nào ngu
router.delete('/:id/force', auth, authAdmin, userController.deleteForceUser)

module.exports = router
