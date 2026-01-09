const User = require("../models/userModel")
const bcrypt = require("bcryptjs")
const OTP = require("../models/otpModel")

const { generateToken } = require("../utils/generateToken")
const { sendOtp } = require("../utils/sendOtp")
exports.registration = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(401).json({ message: "All Fields are Required !" })
        }
        const extuser = await User.findOne({ email })
        if (extuser) {
            return res.status(401).json({ message: "User Already Exist." })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name,
            email,
            password: hashPassword
        })
        res.status(201).json({ message: "User Registered Successfully.", newUser })

    } catch (error) {
        res.status(501).json({ message: "Registration Failed !", error })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(401).json({ message: "Email and Password are Required !" })
    }

    const user = await User.findOne({ email }).select("+password")
    if (!user) {
        return res.status(401).json({ message: "User not Found !" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid Passwprd" })
    }
    const token = generateToken(user._id, res)
    res.status(201).json({ message: "Log in Successfully.", user, token })
}

exports.getUserProfile = async (req, res) => {

    try {
        res.status(200).json({ success: true, user: req.user });

    } catch (error) {
        res.status(500).json({ message: "Error fetching user profile" });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.status(404).json({ message: "Email is Required" })
    }
    const user = await User.findOne({ email })

    if (!user) {
        return res.status(401).json({ message: "User not Found" })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await OTP.findOneAndUpdate(
        { email },
        { email, otp, expireAt: Date.now() + 5 * 60 * 1000 },
        { upsert: true }
    )
    await sendOtp({
        email,
        subject: "OTP send Successfully.",
        message: `OTP is ${otp}`
    })
    res.status(201).json({ success: true, message: "OTP send Successfully.", email })
}

exports.verifyOtp = async (req, res) => {
    const { otp, email } = req.body
    if (!otp) {
        return res.status(404).json({ message: "OTP are Required" })
    }

    console.log(email);
    const checkOtp = await OTP.findOne({ email })

    if (!checkOtp) {
        return res.status(401).json({ message: "OTP not Found" })
    }
    if (checkOtp.otp !== otp) {
        return res.status(401).json({ message: "OTP Invalid !" })
    }
    if (checkOtp.expireAt < Date.now()) {
        return res.status(401).json({ message: "OTP was Expired" })
    }

    const user = await User.findOne({ email })
    if (!user) {
        return res.status(401).json({ message: "User not Found !" })
    }
    res.status(201).json({ success: true, message: "OTP Verify Successfully", email })
}

exports.resetPassword = async (req, res) => {
    const { newPassword, confirmPassword, email } = req.body
    if (!newPassword || !confirmPassword) {
        return res.status(401).json({ message: "Passwords are Required" })
    }

    if (newPassword !== confirmPassword) {
        return res.status(401).json({ message: "OTP does not Match with Confirm-Password" })
    }

    const user = await User.findOne({ email })

    if (!user) {
        return res.status(401).json({ message: "User not Found !" })
    }
    const matchPassword = await bcrypt.hash(newPassword, 10)
    user.password = matchPassword

    await user.save()
    await OTP.deleteOne({ email })
    res.status(201).json({ success: true, message: "Password reset Successfully." })
}

exports.resendOtp = async (req, res) => {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({ message: "Email is required" })
    }

    const otp = Math.floor(100000 + Math.random() * 900000)

    await OTP.findOneAndUpdate(
        { email },
        { otp, createdAt: Date.now() },
        { upsert: true }
    )

    await sendOtp({
        email,
        subject: "Resend OTP",
        message: `Your OTP is ${otp}`
    })

    res.status(200).json({ message: "OTP sent again to your email" })
}
