require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')

// Route
const route = require('./routes')

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
		useTempFiles: true,
	})
)

// Route run
route(app)

// Run & lisen port
app.listen(port, () => {
	console.log(`App đang chạy ở port:${port}\nhttp://localhost:${port}`)
})
