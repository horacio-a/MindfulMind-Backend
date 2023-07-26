
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: 'mindfulmindsuport@gmail.com',
        pass: process.env.googlePassword
    }
});

transporter.verify().then(() => {
    console.log('ready to send emails')
})

module.exports = transporter