const { unlink } = require('fs').promises

const fetch = require('node-fetch')
const uploadController = {
	upload: async (req, res) => {
		try {
			const images = []
			if (!req.files || Object.keys(req.files).length === 0)
				return res.status(400).json({ message: 'Vui lòng chọn hình ảnh' })
			const files = req.files

			for (let file of files) {
				images.push({
					public_name: file.filename,
					url: `https://${req.headers.host}/images/${file.filename}`,
				})
			}

			return res.status(200).json({ images })
		} catch (error) {
			return res.status(500).json({ message: 'Có lỗi xảy ra' + error.message })
		}
	},

	destroy: async (req, res) => {
		try {
			const public_name = req.params.public_name

			if (!public_name)
				return res.status(400).json({ message: 'Không có ảnh nào để xóa' })

			await unlink(`./uploads/${public_name}`)

			return res.status(200).json({ message: 'Xóa ảnh thành công' })
		} catch (error) {
			return res.status(500).json({ message: 'Có lỗi xảy ra' + error.message })
		}
	},

	destroyArrayImage: async (req, res) => {
		try {
			const { images } = req.body

			if (!images)
				return res.status(400).json({ message: 'Không có ảnh nào để xóa' })

			for (item of images) {
				await unlink(`./uploads/${item.public_name}`)
			}
			return res.status(200).json({ message: 'Xóa ảnh thành công' })
		} catch (error) {
			return res.status(500).json({ message: 'Có lỗi xảy ra' + error.message })
		}
	},
	uploadToGitHub: async (req, res) => {
		try {
			const images = []
			if (!req.files || Object.keys(req.files).length === 0)
				return res.status(400).json({ message: 'Vui lòng chọn hình ảnh' })
			const files = req.files

			for (let file of files) {
				const filename = Date.now().toString() + file.originalname
				const gitHubAPI = `https://api.github.com/repos/L1RF/l1rf-images/contents/${filename}`
				const base64 = file.buffer.toString('base64')
				const data = {
					message: 'upload image',
					content: base64,
				}

				fetch(gitHubAPI, {
					method: 'PUT',
					headers: {
						Authorization: `Token ${process.env.TOKEN_GITHUB_UPLOAD_IMAGES}`,
						'Content-type': 'application/vnd.github+json',
					},
					body: JSON.stringify(data),
				})
					.then((res) => {
						return res.json()
					})
					.then((data) => {
						console.log({ data })
					})
					.catch((err) => {
						console.log(err)
					})
			}

			return res.status(200).json({ images })
		} catch (error) {
			return res.status(500).json({ message: 'Có lỗi xảy ra' + error.message })
		}
	},
}

module.exports = uploadController
