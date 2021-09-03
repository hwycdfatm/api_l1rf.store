const cloudinary = require('cloudinary')

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
})

function uploadCloudinary(file) {
	return new Promise((resolve, reject) => {
		cloudinary.v2.uploader.upload(
			file.tempFilePath,
			{ folder: process.env.FOLDER_NAME },
			(error, results) => {
				if (error) return reject(error)
				return resolve({
					public_id: results.public_id,
					url: results.secure_url,
				})
			}
		)
	})
}

function removeCloudinary(public_id) {
	return new Promise((resolve, reject) => {
		cloudinary.v2.uploader.destroy(public_id, (error, result) => {
			if (error) return reject(error)
			return resolve(result)
		})
	})
}

module.exports = { uploadCloudinary, removeCloudinary }
