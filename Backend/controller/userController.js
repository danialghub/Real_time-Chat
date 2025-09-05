import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../lib/utils.js'
import cloudinary from '../lib/cloudinary.js'

//User Signup
export const signUp = async (req, res) => {
    const { fullName, email, password, bio } = req.body

    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "Missing Details" })
        }
        const user = await User.findOne({ email })
        
        
        if (user) {
            return res.json({ success: false, message: "Account Already Exist!" })
        }
        const salt =await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio
        })
        const token = generateToken(newUser._id)
        res.json({ success: true, userData: newUser, token, message: "Account Created Successfully" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
//User Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid Email or Password" })
        }
        const token = generateToken(user._id)
        res.json({ success: true, userData: user, token, message: "login Successful" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//Controller to check if user is Authenticated
export const checkAuth = async (req, res) => {
    res.json({ success: true, user: req.user })
}

//controller to update user profile details

export const updateProfile = async (req, res) => {
    try {
        const { profilePic, fullName, bio } = req.body
        const userId = req.user._id
        let updateUser;

        if (!profilePic) {
            updateUser = await User.findByIdAndUpdate(userId, { fullName, bio }, { new: true })
        } else {
            const uploadUrl = await cloudinary.uploader.upload(profilePic)
            updateUser = await User.findByIdAndUpdate(userId, { fullName, bio, profilePic: uploadUrl.secure_url }, { new: true })
        }
        res.json({ success: true, user: updateUser })
    } catch (error) {
        res.json({ success: true, message: error.message })
    }
}