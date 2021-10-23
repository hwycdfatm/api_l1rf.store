const crypto = require('crypto')
const fetch = require('node-fetch')

const momoPaymentApi = (orderId, orderInfo, amount) => {
	const partnerCode = process.env.PARTONER_CODE_MOMO
	const accessKey = process.env.ACCESS_KEY_MOMO
	const secretkey = process.env.SECRET_KEY_MOMO
	const requestId = partnerCode + new Date().getTime()
	const redirectUrl = 'https://facebook.com/mai.tritoann'
	const ipnUrl = 'https://callback.url/notify'
	const requestType = 'captureWallet'
	const extraData = ''

	const rawSignature =
		'accessKey=' +
		accessKey +
		'&amount=' +
		amount +
		'&extraData=' +
		extraData +
		'&ipnUrl=' +
		ipnUrl +
		'&orderId=' +
		orderId +
		'&orderInfo=' +
		orderInfo +
		'&partnerCode=' +
		partnerCode +
		'&redirectUrl=' +
		redirectUrl +
		'&requestId=' +
		requestId +
		'&requestType=' +
		requestType

	const signature = crypto
		.createHmac('sha256', secretkey)
		.update(rawSignature)
		.digest('hex')

	const requestBody = JSON.stringify({
		partnerCode: partnerCode,
		accessKey: accessKey,
		requestId: requestId,
		amount: amount,
		orderId: orderId,
		orderInfo: orderInfo,
		redirectUrl: redirectUrl,
		ipnUrl: ipnUrl,
		extraData: extraData,
		requestType: requestType,
		signature: signature,
		lang: 'en',
	})
	const enpoint = 'test-payment.momo.vn/v2/gateway/api/create'
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(requestBody),
		},
	}
	fetch(enpoint, options).then((response) => response.json)
}

module.exports = momoPaymentApi
