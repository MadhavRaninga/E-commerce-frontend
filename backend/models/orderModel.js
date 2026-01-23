const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderItem: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true,
            }
        }
    ],
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Processing"
    },
    orderStatus: {
        type: String,
        enum: ["Order Placed", "Processing", "Out for Delivery", "Delivered"],
        default: "Order Placed",
    },
}, { timestamps: true })

module.exports = mongoose.model("Order", orderSchema)