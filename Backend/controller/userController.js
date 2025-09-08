import User from '../models/User.js'
import FriendRequest from '../models/FriendRequest.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../lib/utils.js'
import cloudinary from '../lib/cloudinary.js'
import mongoose from 'mongoose'
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
        const salt = await bcrypt.genSalt(10)
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

//send FriendShip Request
export const searchForUsers = async (req, res) => {
    try {

        const { input } = req.params

        const myId = req.user._id

        const users = await User.find({ fullName: { $regex: input, $options: "i" }, _id: { $ne: myId }, friends: { $ne: myId } }).select('-password -friends')


        if (!users.length)
            return res.json({ success: false, message: "کاربری یافت نشد!" })

        res.json({ success: true, users })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
export const sendFriendRequest = async (req, res) => {
    try {
        const from = req.user._id
        const { to } = req.body
        const existing = await FriendRequest.findOne({ from, to, status: "Pending" })
        if (existing)
            return res.json({ success: false, message: "درخواست قبلا داده شد" })

        await FriendRequest.create({
            from,
            to
        })
        res.json({ success: true, message: "درخواست با موفقیت ارسال شد" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
export const getFriendRequest = async (req, res) => {
    try {
        const to = req.user._id

        const requests = await FriendRequest.find({ to, status: { $eq: "Pending" } })
            .populate('from', 'fullName email profilePic')
            .exec()
        res.json({ success: true, requests })
    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}
export const response2Request = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { from, status } = req.body
        const to = req.user._id

        const request = await FriendRequest.updateOne({ from, to, status: "Pending" }, { status })

        if (request.matchedCount === 0) {
            return res.json({ success: false, message: "درخواستی یافت نشد" });
        }

        if (status == "Accepted") {
            await User.bulkWrite([
                {
                    updateOne: {
                        filter: { _id: to },
                        update: { $addToSet: { friends: from } }
                    }
                },
                {
                    updateOne: {
                        filter: { _id: from },
                        update: { $addToSet: { friends: to } }
                    }
                }
            ], { session })
        }
        await session.commitTransaction();
        session.endSession();

        res.json({ success: true, message: "عملیات موفقیت آمیز بود" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}