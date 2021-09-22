const router = require('express').Router()
const Payment = require('../controllers/paymentController')

// Auth
const Auth = require('../middlewares/auth')
const AuthAdmin = require('../middlewares/authAdmin')

router.get('/', Auth, Payment.getPayments)
router.get('/admin', Auth, AuthAdmin, Payment.getAllPayments)
router.post('/', Auth, Payment.creatPayment)
router.patch('/:id', Auth, AuthAdmin, Payment.updatePayment)

module.exports = router
