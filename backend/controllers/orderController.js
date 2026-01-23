const Order = require("../models/orderModel")
const Cart = require("../models/cartModel")
const Product = require("../models/productModel")
exports.order = async (req, res) => {
    try {
        const userId = req.user._id
        const { address, city, pincode } = req.body

        if (!address || !city || !pincode) {
            return res.status(401).json({ message: "Address Detail Required" })
        }
        const cart = await Cart.findOne({ user: userId })
            .populate("items.product");
        if (!cart) {
            return res.status(401).json({ message: "Cart not Found" })
        }
        console.log("cart", cart.items);

        // const product = await Product.findById(productId)
        // console.log(product);

        // if (!product) {
        //     return res.status(404).json({ message: "Product not Found" })
        // }

        let total = 0;
        const orderItem = [];

        cart.items.forEach((item) => {

            orderItem.push({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
            });
            total += item.product.price * item.quantity;
        });

        const order = await Order.create({
            user: userId,
            orderItem,
            address,
            city,
            pincode,
            total,
            orderStatus: "Order Placed" 
        })

        cart.items = []
        await cart.save()
        res.status(200).json({ message: "Order Placed Successfully.", order })
    } catch (error) {
        res.status(500).json({ message: "Error while Order Placed", error: error.message })
    }
}

exports.getMyorders = async (req, res) => {
    try {
        const userId = req.user._id

        const orders = await Order.find({ user: userId })

        res.status(201).json({ success: true, orders })

    } catch (error) {
        res.status(500).json({ message: "error while get All orders", error: error.message })
    }
}

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("orderItem.product")
            .populate("user", "name email");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching order",
            error: error.message,
        });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body
        const id = req.params.id

        const order = await Order.findByIdAndUpdate(id, { orderStatus: status },
            {
                new: true,
                runValidators: true
            }
        )
        if (!order) {
            return res.status(401).json({ message: "Order not Found" })
        }
        res.status(200).json({ message: "Order Status Updated", order })
    } catch (error) {
        res.status(500).json({ message: "Error while update Status", error: error.message })
    }
}