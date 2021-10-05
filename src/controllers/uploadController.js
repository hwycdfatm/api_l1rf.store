const { unlink } = require('fs').promises

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
					url: `http://${req.headers.host}/images/${file.filename}`,
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
}

module.exports = uploadController
