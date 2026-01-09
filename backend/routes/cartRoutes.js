const express = require("express")
const { isAuth } = require("../middleware/isAuth")
const { addtoCart, updateCart, deleteCart, getcart } = require("../controllers/cartController")
const router = express.Router()

router.post("/addtoCart", isAuth, addtoCart)
router.get("/getcart", isAuth, getcart)
router.put("/updateCart", isAuth, updateCart)
router.delete("/delete/:id", isAuth, deleteCart)

module.exports = router