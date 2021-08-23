const router = require('express').Router()
const Product = require('../controllers/productController')

router.get('/', Product.getProducts)
router.get('/:slug', Product.getProduct)
router.get('/id/:id', Product.getProductById)
router.post('/', Product.createProduct)
router.put('/:id', Product.updateProduct)
router.delete('/:id', Product.deleteProduct)

module.exports = router
