const router = require('express').Router()
const category = require('../controllers/categoryController')

const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

// RESTFUL API
router
	.route('/category')
	.get(category.getCategory)
	.post(auth, authAdmin, category.createCategory)
	.put(auth, authAdmin, category.updateCategory)
	.delete(auth, authAdmin, category.deleteCategory)

module.exports = router
