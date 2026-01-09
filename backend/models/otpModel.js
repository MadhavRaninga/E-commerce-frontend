const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({

    email:{
        type: String,
        required: [true, "Email is require"],
        unique: true
    },
    otp: {
        type: String,
        required: [true, "Otp is require"],
    },
    expireAt: {
        type: Date,
    }

  
})
module.exports = mongoose.model("OTP", otpSchema)