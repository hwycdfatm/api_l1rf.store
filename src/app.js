require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')

// Connect Database
const { connectDB } = require('./config/db')
connectDB()

// Config App
const app = express()
const port = 5000

// Config modul
app.use(express.json())

app.use(
	express.urlencoded({
		extended: true,
	})
)
app.use(cookieParser())

app.use(morgan('combined'))

app.use(cors())

app.use(
	fileUpload({
		useTemplate: true,
	})
)

// Routers
const userRouter = require('./routes/userRouter')
const categoryRouter = require('./routes/categoryRouter')
const uploadRouter = require('./routes/upload')
// App Run
app.use('/user', userRouter)
app.use('/api', categoryRouter)
app.use('/api', uploadRouter)
// Run & lisen port
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
