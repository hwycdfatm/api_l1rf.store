const nodemailer = require('nodemailer')

const sendMail = (email, url) => {
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
		subject: 'L1RF STORE RESET PASSWWORD',
		html: `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Display&display=swap" rel="stylesheet">
        </head>
        
        <body>
            <div
                style="max-width: 700px; margin:auto; border: 1px solid #ddd; padding: 50px 20px; font-size: 110%; font-size: 14px; font-family: 'Noto Sans Display', sans-serif;">
                <div style="width: 50%;">
                    <img src="https://res.cloudinary.com/l1rfstore/image/upload/c_crop,h_173,w_500/v1633184357/l_phrcfo.png"
                        alt="" style="width: 100%; height:100%">
                </div>
                <hr>
                <p ">Xin chào bạn.<br />
                    <br />
                    Gần đây đã có người yêu cầu đặt lại mật khẩu cho tài khoản của bạn
                </p>
                <br />
                <a href=${url}
                    style=" text-decoration: none; color: #ffa31a; font-weight: 500; display: inline-block; ">Nhấn
                    vào
                    đây để đổi mật khẩu của bạn</a>
                    <br />
                    <br />
                <p>Bạn đã không yêu cầu thay đổi này ?</p>
                <span>Nếu bạn đã không yêu cầu mật khẩu mới, hãy bỏ qua email này</span>
                <br />
                <br />
                <br />
                <a href=" ${url}"
                    style="display:inline-block; text-decoration: none; padding: 0.8rem 1rem; background-color: #1b1b1b; color: #ffa31a">
                    Thay đổi mật
                    khẩu</a>
                    <br />
                    <br />
                    <br />
                    <hr>
                <p>l1rf store <br/>
                Bài tập lớn học phần của Mai Trí Toàn & Nguyễn Quốc Thịnh
                </p>
               
            </div>
        </body>
        
        </html>`,
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
