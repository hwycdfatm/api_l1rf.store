const nodemailer = require('nodemailer')

const sendMail = (email, url, name) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.USER_MAIL,
			pass: process.env.PASSWORD_MAIL,
		},
	})

	const mailOptions = {
		from: process.env.USER_MAIL,
		to: email,
		subject: 'Yêu cầu khôi phục mật khẩu từ L1RF-STORE',
		html: `
            <div style="max-width:550px; margin:0 auto;">
                <div
                    style="background-color:rgb(75, 240, 199); width: 100%; height:80px; display:flex; justify-content: center; align-items:center">
                    <h3 style="text-align:center; font-weight: bolder; color:aliceblue; font-size:30px ">L1RF STORE</h3>
                </div>
                <div style="padding:1rem 2rem; width: 100%;">
                    <p style="font-weight: 700;">Xin chào ${name} !</p>
                    <p style="font-size:14px;">Gần đây đã có người yêu cầu đặt lại mật khẩu cho tài khoản của bạn</p>
                    <div style="text-align:center; margin-top:2rem">
                        <a href="${url}"
                            style="background-color: black; padding: 0.5rem 1rem; border-radius: 0.3rem; text-decoration: none; font-weight: 300; color:beige">Đặt
                            lại
                            mật
                            khẩu</a>
                    </div>
                    <br />
                    <br />
                    <p style="font-weight:700;">Bạn đã không yêu cầu thay đổi này ?</p>
                    <span>Nếu bạn đã không yêu cầu mật khẩu mới, hãy bỏ qua email này</span>
                    <br />
                    <br />
                    <a href="${url}">Nhấn vào đây nếu không hoạt động</a>
                    <a href="${url}">${url}</a>
                </div>
                <br />
                <br />
                <br />
                <div style="border-top: 1px solid #ccc; text-align: center; padding-top:0.5rem; width: 100%;">
                    <p>@2021 L1RF.ONLINE</p>
                    <span>Bài tập lớn học phần</span>
                    <br />
                    <span>Mai Trí Toàn & Nguyễn Quốc Thịnh</span>
                </div>
            </div>
  
       `,
	}

	transporter.sendMail(mailOptions, (err, data) => {
		if (err) {
			console.log(err)
		} else {
			console.log(data)
		}
	})
}

module.exports = sendMail
