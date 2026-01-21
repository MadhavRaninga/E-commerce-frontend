const express = require("express");
const { isAuth } = require("../middleware/isAuth");
const { isAdmin } = require("../middleware/isAdmin");
const {
  adminLogin,
  getAdminStats,
  getAllUsers,
  updateUserByAdmin,
  getAllOrdersAdmin,
} = require("../controllers/adminController");

const router = express.Router();

// Auth
router.post("/login", adminLogin);

// Protected admin APIs
router.get("/stats", isAuth, isAdmin, getAdminStats);
router.get("/users", isAuth, isAdmin, getAllUsers);
router.put("/users/:id", isAuth, isAdmin, updateUserByAdmin);
router.get("/orders", isAuth, isAdmin, getAllOrdersAdmin);

module.exports = router;

