require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const { connectDB } = require('./config/db')
const app = express()
const port = 3000

connectDB()

app.use(express.json())
app.use(
	express.urlencoded({
		extended: true,
	})
)
app.use(morgan('combined'))
app.use(cors())

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
