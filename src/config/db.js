const mongoose = require('mongoose')

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.URI_LOCAL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		console.log('Kết nối DB thành công')
	} catch (error) {
		console.log('Kết nối DB thất bại')
	}
}

module.exports = { connectDB }
