const userRouter = require('./userRouter')
const categoryRouter = require('./categoryRouter')
const uploadRouter = require('./uploadRouter')
const productRouter = require('./productRouter')
const paymentRouter = require('./paymentRouter')
const sliderRouter = require('./sliderRouter')
const assectRouter = require('./assectRouter')
const tokenRouter = require('./tokenRouter')
function route(app) {
	app.use('/api_v1/user', userRouter)
	app.use('/api_v1/category', categoryRouter)
	app.use('/api_v1/product', productRouter)
	app.use('/api_v1', uploadRouter)
	app.use('/api_v1/payment', paymentRouter)
	app.use('/api_v1/slider', sliderRouter)
	app.use('/api_v1/assect', assectRouter)
	app.use('/api_v1/token', tokenRouter)
}

module.exports = route
