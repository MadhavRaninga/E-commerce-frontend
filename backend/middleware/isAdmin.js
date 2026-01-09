exports.isAdmin = async(req, res, next) =>{
    try {
        const user = req.user
        if (!user || !user.isAdmin) {
            return res.status(404).json({message: "Admin not Authorized !"})
        }
        next()
    } catch (error) {
        return res.status(501).json({message: "Error While Admin Authorize !"})
    }
}