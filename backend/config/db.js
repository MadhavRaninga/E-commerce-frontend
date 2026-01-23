const mongoose = require("mongoose")

exports.connectDB = ()=>{
    try {
        mongoose.connect(process.env.ATLAS_URL)
        .then(()=>console.log("Mongo DB Atlas is Connected."))
        .catch(()=>console.log("Error While Connection."))
    } catch (error) {
        console.error("Error in Server !", error)
    }
}