const router = require('express').Router()
const Payment = require('../controllers/paymentController')

// Auth
const Auth = require('../middlewares/auth')
const AuthAdmin = require('../middlewares/authAdmin')

router.get('/', Auth, Payment.getPayments)
router.get('/admin', Auth, AuthAdmin, Payment.getAllPayments)
router.get('/dataofpayment', Auth, AuthAdmin, Payment.getDataOfPayments)
router.get('/deleted', Auth, AuthAdmin, Payment.getAllPaymentsDeleted)
router.post('/', Auth, Payment.createPayment)
router.put('/:id', Auth, AuthAdmin, Payment.updatePayment)
router.patch('/:id/restore', Auth, AuthAdmin, Payment.restorePayment)
router.delete('/:id', Auth, AuthAdmin, Payment.deletePayment)
router.delete('/:id/force', Auth, AuthAdmin, Payment.deleteForcePayment)

module.exports = router
