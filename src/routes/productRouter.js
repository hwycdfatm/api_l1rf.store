const router = require('express').Router()
const Product = require('../controllers/productController')

router.get('/', Product.getProduct)

module.exports = router
