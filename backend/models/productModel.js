const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product Name id required"],

    },
    description: {
        type: String,
        required: [true, "Product Description is required"],
    },
    price: {
        type: Number,
        required: [true, "Product Price is required"],
    },
    stock: {
        type: Number,
        required: [true, "Product stock is required"],
        default: 1
    },
    image: {
        public_id: String,
        url: String
    },
    category: {
        type: String,
        required: [true, "Product category is required"],
    }
}, { timestamps: true })

module.exports = mongoose.model("Product", productSchema)