import express from 'express'
import { checkAuth, getFriendRequest, login, response2Request, searchForUsers, sendFriendRequest, signUp, updateProfile } from '../controller/userController.js'
import { protectRoute } from '../middleware/auth.js'

const userRouter = express.Router()


userRouter.post('/signup', signUp)
userRouter.post('/login', login)

userRouter.get('/search-user/:input', protectRoute, searchForUsers)
userRouter.get('/requests', protectRoute, getFriendRequest)
userRouter.post('/send-request', protectRoute, sendFriendRequest)
userRouter.put('/response-2-request', protectRoute, response2Request)

userRouter.put('/update-profile', protectRoute, updateProfile)

userRouter.get('/check', protectRoute, checkAuth)


export default userRouter
