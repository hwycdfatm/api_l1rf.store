const router = require('express').Router()
const Product = require('../controllers/productController')

const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

router.get('/', Product.getProducts)
router.get('/:slug', Product.getProduct)
router.get('/id/:id', Product.getProductById)
router.get('/bts/trash', auth, authAdmin, Product.getProductDeleted)
router.post('/', auth, authAdmin, Product.createProduct)
router.put('/:id', auth, authAdmin, Product.updateProduct)
router.put('/:id/change-visible', auth, authAdmin, Product.changeVisibility)
router.patch('/:id/restore', auth, authAdmin, Product.restoreProduct)
router.delete('/:id', auth, authAdmin, Product.deleteProduct)
router.delete('/:id/force', auth, authAdmin, Product.deleteProductDeleted)

module.exports = router
