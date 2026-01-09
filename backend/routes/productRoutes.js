const express = require("express")
const { addProduct, getall, getbyId, updateProduct, deleteProduct } = require("../controllers/productController")
const { isAuth } = require("../middleware/isAuth")
const { isAdmin } = require("../middleware/isAdmin")
const upload = require("../middleware/cloudinary")
const router = express.Router()

router.post("/addProduct", isAuth, isAdmin, upload.single("image"),  addProduct)
router.get("/getallProduct", isAuth, isAdmin, getall)
router.get("/getbyId/:id", isAuth, isAdmin, getbyId)
router.put("/updateProduct/:id", isAuth,upload.single("image"), isAdmin, updateProduct)
router.delete("/deleteProduct/:id", isAuth, isAdmin, deleteProduct)

module.exports = router