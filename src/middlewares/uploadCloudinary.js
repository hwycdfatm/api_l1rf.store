const cloudinary = require('cloudinary')

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

module.exports = uploadCloudinary
