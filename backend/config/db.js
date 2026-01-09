const mongoose = require("mongoose")

exports.connectDB = ()=>{
    try {
        mongoose.connect(process.env.MONGOOSE_URL)
        .then(()=>console.log("DB is Connected."))
        .catch(()=>console.log("Error While Connection."))
    } catch (error) {
        console.error("Error in Server !", error)
    }
}