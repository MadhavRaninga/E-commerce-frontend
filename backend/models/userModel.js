const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Name is Required"]
    },
    email:{
        type: String,
        required: [true, "Email is Required"],
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    isAdmin:{
        type: Boolean,
        default: false
    }
}, {timestamps: true})

module.exports = mongoose.model("User", userSchema)