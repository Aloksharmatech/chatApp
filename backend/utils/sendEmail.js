const nodemailer = require('nodemailer');
require("dotenv").config();

const sendEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    });


    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "verify you email",
        text: `Your OTP for registration is ${otp}`
    }

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;