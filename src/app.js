require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
// Route
const route = require('./routes')

// Connect Database
const { connectDB } = require('./config/db')

connectDB()

// Config App
const app = express()
const port = process.env.PORT || 5000

// // Config modul
app.use(express.json())

app.use(
	express.urlencoded({
		extended: true,
	})
)
app.use(cookieParser())

if (process.env.NODE_ENV !== 'production') {
	const morgan = require('morgan')
	app.use(morgan('combined'))
}

const corsOptions = {
	//To allow requests from client
	origin: [
		'https://l1rf-store.surge.sh',
		'http://localhost:3000',
		'https://objective-mayer-ced09b.netlify.app',
		'https://l1rf.online',
	],
	credentials: true,
}

app.use(cors(corsOptions))

// config static route images
app.use('/images', express.static('uploads'))

// Route run
route(app)

// Run & lisen port
app.listen(port, () => {
	console.log(`App đang chạy ở port:${port}\nhttp://localhost:${port}`)
})
