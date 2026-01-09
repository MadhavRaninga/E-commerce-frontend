const express = require("express")
const { connectDB } = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const productRoutes = require("./routes/productRoutes")
const cartRoutes = require("./routes/cartRoutes")
const orderRoutes = require("./routes/orderRoutes")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")

const app = express()
dotenv.config()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}))
app.use("/api/user", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)

connectDB()
app.listen(process.env.PORT, ()=>{
    console.log(`Server is Working on : ${process.env.PORT}`);
})