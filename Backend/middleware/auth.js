import User from "../models/User.js"
import jwt from 'jsonwebtoken'

//middleware for protect routes


export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decodedToken.id).select("-password")
        
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }
        req.user = user
        next()
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}