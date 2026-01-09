const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

exports.isAuth = async(req, res, next)=>{
    try {
        const {token} = req.cookies
        
        if (!token) {
            return res.status(401).json({message: "User not Authenticated !"})
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)

        const user = await User.findById(decode.id)

        if (!user) {
            return res.status(401).json({message: "User not Found !"})
        }
        req.user = user
        next()
    } catch (error) {
            return res.status(401).json({message: "Error while Authentication !", error})
    }
}
