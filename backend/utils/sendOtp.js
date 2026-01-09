const nodemailer = require("nodemailer");

exports.sendOtp = async (option) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.OTP_USER,
            pass: process.env.OTP_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.OTP_USER,
        to: option.email,
        subject: option.subject,
        html: `<h2>${option.message}</h2>`,
    });
}