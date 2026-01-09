const express = require("express")
const { registration, login, getUserProfile, forgotPassword, verifyOtp, resetPassword, resendOtp } = require("../controllers/userController")
const { isAuth } = require("../middleware/isAuth")
const router = express.Router()

router.post("/registration", registration)
router.post("/login", login)
router.get("/profile", isAuth, getUserProfile)

router.post("/sendOtp", forgotPassword)
router.post("/verify", verifyOtp)
router.post("/resetpassword", resetPassword)
router.post("/resendotp", resendOtp)
module.exports = router