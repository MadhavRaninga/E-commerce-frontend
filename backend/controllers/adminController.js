const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const { generateToken } = require("../utils/generateToken");

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are Required !" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "User not Found !" });
    }
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Admin not Authorized !" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = generateToken(user._id, res);
    const safeUser = await User.findById(user._id); // without password

    return res.status(200).json({
      message: "Admin login Successfully.",
      user: safeUser,
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Admin login failed", error: error.message });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const [users, products, orders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      stats: { users, products, orders },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while fetching stats", error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while fetching users", error: error.message });
  }
};

exports.updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, isAdmin } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not Found !" });

    if (typeof name !== "undefined") user.name = name;
    if (typeof email !== "undefined") user.email = email;
    if (typeof isAdmin !== "undefined") user.isAdmin = !!isAdmin;

    await user.save();

    return res.status(200).json({ message: "User Updated", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while updating user", error: error.message });
  }
};

exports.getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email isAdmin")
      .populate("orderItem.product", "name price image category");

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while fetching orders", error: error.message });
  }
};

