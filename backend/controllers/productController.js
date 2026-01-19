const Product = require("../models/productModel")
const upload = require("../middleware/cloudinary")
const cloudinary = require("../middleware/cloudinary")
exports.addProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, discount, isNewArrival } = req.body

        if (!name || !description || !price || !stock || !category) {
            return res.status(400).json({ message: "All Fields are Required !" })
        }
        const existingProduct = await Product.findOne({ name });

        if (existingProduct) {
            return res.status(404).json({ message: "Product already exists", });
        }
        if (!req.file) {
            return res.status(404).json({ message: "Image are Required", });
        }
        const product = await Product.create({
            name,
            description,
            price,
            discount,
            stock,
            image: req.file.path,
            category,
            isNewArrival
        })

        res.status(201).json({ message: "Product Added Successfully.", product })

    } catch (error) {
        res.status(500).json({ message: "Error while Add product !", error: error.message })
    }
}

exports.getall = async (req, res) => {
    try {
        const products = await Product.find()

        res.status(200).json({ success: true, products })
    } catch (error) {
        res.status(500).json({ message: "Error while get Product !", error: error.message })
    }
}

exports.getbyId = async (req, res) => {
    try {
        const id = req.params.id

        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ message: "Product not Found" })
        }
        res.status(200).json({ success: true, product })

    } catch (error) {
        return res.status(500).json({ message: "Error while get Product", error: error.message })
    }

}

exports.updateProduct = async (req, res) => {
    try {
        const { name, price, description, stock, category } = req.body
        const id = req.params.id

        const product = await Product.findByIdAndUpdate(id,
            { name, price, description, stock, category },
            {
                new: true,
                runValidators: true
            })
        if (!product) {
            return res.status(404).json({ message: "Product not Found" })
        }

        

        res.status(200).json({ message: "Product Updated Successfully.", product })

    } catch (error) {
        res.status(500).json({ message: "Error while update Product.", error: error.message })
    }
}

exports.deleteProduct = async (req, res) => {
    const id = req.params.id

    const product = await Product.findByIdAndDelete(id)
    if (!product) {
        return res.status(404).json({ message: "Product not Found" })
    }
    res.status(200).json({ success: true, message: "Product Deleted Successfully." })
}