const express = require("express");
const User = require("../models/userModel");

// WARNING: Only for initial setup. Protect with a secret.
const router = express.Router();

router.post("/make-admin", async (req, res) => {
  try {
    const { secret, email } = req.body;
    if (!secret || !email) {
      return res.status(400).json({ message: "secret and email are required" });
    }

    if (secret !== process.env.ADMIN_BOOTSTRAP_SECRET) {
      return res.status(403).json({ message: "Invalid secret" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not Found !" });

    user.isAdmin = true;
    await user.save();

    return res.status(200).json({ message: "User promoted to admin", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Bootstrap failed", error: error.message });
  }
});

module.exports = router;

