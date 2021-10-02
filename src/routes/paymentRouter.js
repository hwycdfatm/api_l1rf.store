const router = require('express').Router()
const Payment = require('../controllers/paymentController')

// Auth
const Auth = require('../middlewares/auth')
const AuthAdmin = require('../middlewares/authAdmin')

router.get('/', Auth, Payment.getPayments)
router.get('/admin', Auth, AuthAdmin, Payment.getAllPayments)
router.get('/deleted', Auth, AuthAdmin, Payment.getAllPaymentsDeleted)
router.post('/', Auth, Payment.creatPayment)
router.put('/:id', Auth, AuthAdmin, Payment.updatePayment)
router.patch('/:id/restore', Auth, AuthAdmin, Payment.restorePayment)
router.delete('/:id', Auth, AuthAdmin, Payment.deletePayment)
router.delete('/:id/force', Auth, AuthAdmin, Payment.deleteForcePayment)

module.exports = router
