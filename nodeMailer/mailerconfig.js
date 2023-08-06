
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'mindfulmindsuport@gmail.com',
        pass: process.env.googlePassword
    }
});



module.exports = transporter