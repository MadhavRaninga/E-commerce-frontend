const Cart = require("../models/cartModel")
const Product = require("../models/productModel")

exports.addtoCart = async (req, res) => {
    try {
        const userId = req.user._id
        const { productId, quantity } = req.body

        if (!productId) {
            return res.status(400).json({ message: "Product Id is Required" })
        }
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: "Product not Found" })
        }
        let cart = await Cart.findOne({ user: userId })

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [{ product: productId, quantity: quantity }]
            })
        }
        else {
            const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId)

            if (itemIndex !== -1) {
                cart.items[itemIndex].quantity += quantity
            }
            else {
                cart.items.push({
                    product: productId,
                    quantity: quantity
                })
            }
            await cart.save()
        }
        res.status(200).json({ success: true, message: "Product Added to Cart", cart })
    } catch (error) {
        res.status(500).json({ message: "Error While Add to cart", error: error.message })
    }
}

exports.getcart = async (req, res) => {
    try {
        const userId = req.user._id
        const cart = await Cart.findOne({ user: userId })
            .populate("items.product");

        res.status(200).json({ success: true, cart })

    } catch (error) {
        res.status(500).json({ message: "Error whlie get cart", error: error.message })
    }
}
exports.updateCart = async (req, res) => {
    try {
        const userId = req.user._id
        const { itemId, quantity } = req.body

        if (!itemId) {
            return res.status(404).json({ message: "Item ID and Quantity are Required" })
        }

        const cart = await Cart.findOne({ user: userId })
        if (!cart) {
            return res.status(404).json({ message: "Cart not Found" })
        }
        const itemIndex = cart.items.findIndex((item) => item.id === itemId)
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not Found in Cart" })
        }
        cart.items[itemIndex].quantity = quantity

        await cart.save()

        const updatedCart = await Cart.findOne({ user: userId })
            .populate("items.product");
        res.status(200).json({ message: "Cart Quantity Updated.", updatedCart })
    } catch (error) {
        res.status(500).json({ message: "Error While update cart", error: error.message })
    }
}

exports.deleteCart = async (req, res) => {
    try {
        const userId = req.user._id
        const id = req.params.id

        const cart = await Cart.findOne({ user: userId })
        if (!cart) {
            return res.status(404).json({ message: "Cart not Found" })
        }

        cart.items = cart.items.filter((item) => item.id !== id)

        await cart.save()
        res.status(200).json({ message: "Cart Item Deleted Successfully." })

    } catch (error) {
        res.status(500).json({ message: "Error while delete cart", error: error.message })
    }

}