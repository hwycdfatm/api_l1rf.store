const router = require('express').Router()
const Slider = require('../controllers/sliderController')

// Auth
const Auth = require('../middlewares/auth')
const AuthAdmin = require('../middlewares/authAdmin')

router.get('/', Slider.getSliders)
router.post('/', Auth, AuthAdmin, Slider.createSlider)
router.patch('/:id', Auth, AuthAdmin, Slider.updateSlider)
router.delete('/:id', Auth, AuthAdmin, Slider.deleteSlider)

module.exports = router
