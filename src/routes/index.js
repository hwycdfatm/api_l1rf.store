const userRouter = require('./userRouter')
const categoryRouter = require('./categoryRouter')
const uploadRouter = require('./uploadRouter')
const productRouter = require('./productRouter')

function route(app) {
	app.use('/user', userRouter)
	app.use('/api/category', categoryRouter)
	app.use('/api/product', productRouter)
	app.use('/api', uploadRouter)
}

module.exports = route