module.exports = function string_to_slug(str) {
	if (str === undefined) return ''

	str = str.toLowerCase()

	str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

	str = str.replace(/[đĐ]/g, 'd')

	str = str.replace(/([^0-9a-z-\s])/g, '')

	str = str.replace(/(\s+)/g, '-')

	str = str.replace(/-+/g, '-')

	str = str.replace(/^-+|-+$/g, '')

	return str
}
