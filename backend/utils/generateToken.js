const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

exports.generateToken = (id, res)=>{
    const token = jwt.sign({id}, process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRE
    })
    
    const option = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly : true
    }
    res.cookie("token", token, option)
    return token
}