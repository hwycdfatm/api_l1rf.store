const router = require('express').Router()
const Product = require('../controllers/productController')

router.get('/:slug', Product.getProduct)
router.post('/', Product.createProduct)
router.put('/:id', Product.updateProduct)
router.delete('/:id', Product.deleteProduct)
module.exports = router
