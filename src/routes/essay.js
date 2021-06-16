const express = require('express')
const router = express.Router()
const essayController = require('../controllers/essayController')

router.get('/', essayController.get)
router.get('/:id', essayController.getOneById)
router.post('/', essayController.create)
router.put('/:id', essayController.update)
router.delete('/:id', essayController.delete)

module.exports = router
