const { unlink } = require('fs').promises

const { Promise } = require('mongoose')
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

			// create blob and tree
			const blobs = await Promise.all(
				files.map((file) => {
					const base64 = file.buffer.toString('base64')
					const data = {
						content: base64,
						encoding: 'base64',
					}
					return fetch(
						'https://api.github.com/repos/L1RF/l1rf-images/git/blobs',
						{
							method: 'POST',
							headers: {
								Authorization: `Token ${process.env.TOKEN_GITHUB_UPLOAD_IMAGES}`,
								'Content-type': 'application/vnd.github+json',
							},
							body: JSON.stringify(data),
						}
					)
				})
			)

			const blobsData = await Promise.all(blobs.map((blob) => blob.json()))

			const blobsSHA = blobsData.map((blob) => blob.sha)

			const treeSHA = await fetch(
				'https://api.github.com/repos/L1RF/l1rf-images/git/trees/main',
				{
					method: 'GET',
					headers: {
						Authorization: `Token ${process.env.TOKEN_GITHUB_UPLOAD_IMAGES}`,
						'Content-type': 'application/vnd.github+json',
					},
				}
			)

			const treeSHAData = await treeSHA.json()

			const treeSHADataSHA = treeSHAData.sha

			const treeArray = blobsSHA.map((sha, index) => ({
				path: Date.now() + files[index].originalname,
				mode: '100644',
				type: 'blob',
				sha,
			}))
			const treeData = await fetch(
				'https://api.github.com/repos/L1RF/l1rf-images/git/trees',
				{
					method: 'POST',
					headers: {
						Authorization: `Token ${process.env.TOKEN_GITHUB_UPLOAD_IMAGES}`,
						'Content-type': 'application/vnd.github+json',
					},
					body: JSON.stringify({
						base_tree: treeSHADataSHA,
						tree: treeArray,
					}),
				}
			)

			const treeDataData = await treeData.json()

			const treeDataDataSHA = treeDataData.sha

			// create commit
			const commit = await fetch(
				'https://api.github.com/repos/L1RF/l1rf-images/git/commits',
				{
					method: 'POST',
					headers: {
						Authorization: `Token ${process.env.TOKEN_GITHUB_UPLOAD_IMAGES}`,
						'Content-type': 'application/vnd.github+json',
					},
					body: JSON.stringify({
						message: 'upload image',
						tree: treeDataDataSHA,
						parents: [treeSHADataSHA],
					}),
				}
			)

			const commitData = await commit.json()

			const commitDataSHA = commitData.sha

			// update reference
			const reference = await fetch(
				'https://api.github.com/repos/L1RF/l1rf-images/git/refs/heads/main',
				{
					method: 'PATCH',
					headers: {
						Authorization: `Token ${process.env.TOKEN_GITHUB_UPLOAD_IMAGES}`,
						'Content-type': 'application/vnd.github+json',
					},
					body: JSON.stringify({
						sha: commitDataSHA,
						force: true,
					}),
				}
			)

			// get image url
			const imageUrls = treeArray.map((item) => {
				return {
					public_name: item.path,
					url: item.path,
				}
			})

			return res
				.status(200)
				.json({ message: 'Upload ảnh thành công', imageUrls })

			// Old Upload w/Only 1 Image

			// upload image to github
			// const response = await Promise.all(
			// 	files.map((file) => {
			// 		const filename = Date.now().toString() + file.originalname
			// 		const gitHubAPI = `https://api.github.com/repos/L1RF/l1rf-images/contents/${filename.replace(
			// 			/\s+/g,
			// 			''
			// 		)}`
			// 		const base64 = file.buffer.toString('base64')
			// 		const data = {
			// 			message: 'upload image',
			// 			content: base64,
			// 		}
			// 		return fetch(gitHubAPI, {
			// 			method: 'PUT',
			// 			headers: {
			// 				Authorization: `Token ${process.env.TOKEN_GITHUB_UPLOAD_IMAGES}`,
			// 				'Content-type': 'application/vnd.github+json',
			// 			},
			// 			body: JSON.stringify(data),
			// 		})
			// 	})
			// )

			// const data = await Promise.all(response.map((res) => res.json()))

			// for (let item of data) {
			// 	console.log(item)

			// 	// images.push({
			// 	// 	public_name: item.content.name,
			// 	// 	url: item.content.path,
			// 	// })
			// }

			// return res.status(200).json({ images })
		} catch (error) {
			return res.status(500).json({ message: 'Có lỗi xảy ra ' + error.message })
		}
	},
}

module.exports = uploadController
