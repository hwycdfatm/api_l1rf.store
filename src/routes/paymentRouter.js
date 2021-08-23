const router = require('express').Router()
const Payment = require('../controllers/paymentController')

// Auth
const Auth = require('../middlewares/auth')
const AuthAdmin = require('../middlewares/authAdmin')

router.get('/', Auth, AuthAdmin, Payment.getAllPayments)
router.post('/', Auth, AuthAdmin, Payment.creatPayment)
router.put('/:id', Auth, AuthAdmin, Payment.updatePayment)

module.exports = router
