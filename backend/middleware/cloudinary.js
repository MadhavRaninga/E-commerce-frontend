const cloudinary = require("cloudinary").v2
const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv")
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "madhav",
        allowed_formats: ["jpg", "png", "jpeg", "webp"]
    }
})
const upload = multer({ storage })
module.exports = upload