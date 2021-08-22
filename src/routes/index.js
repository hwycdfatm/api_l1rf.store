const userRouter = require('./userRouter')
const categoryRouter = require('./categoryRouter')
const uploadRouter = require('./uploadRouter')
const productRouter = require('./productRouter')
const paymentRouter = require('./paymentRouter')
function route(app) {
	app.use('/user', userRouter)
	app.use('/api/category', categoryRouter)
	app.use('/api/product', productRouter)
	app.use('/api', uploadRouter)
	app.use('/api', paymentRouter)
}

module.exports = route
