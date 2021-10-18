const router = require('express').Router()
const category = require('../controllers/categoryController')

const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

// RESTFUL API
router.get('/', category.getCategories)
router.post('/', auth, authAdmin, category.createCategory)
router.delete('/:id', auth, authAdmin, category.deleteCategory)

module.exports = router
