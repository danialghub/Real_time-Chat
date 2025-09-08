import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import http from 'http'
import { connectMongoDb } from './lib/db.js'
import userRouter from './routes/userRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import { Server } from 'socket.io'

//server Setup
const app = express()
const server = http.createServer(app)

//initialize socket.io server
export const io = new Server(server, {
    cors: { origin: "*" }
})

export const userSocketMap = {}; // {userId : socketId}

//Socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId


    if (userId) userSocketMap[userId] = socket.id


    //Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {

        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

//Middleware Setup
app.use(express.json({ limit: '4mb' }))
app.use(cors())

app.use('/api/status', (req, res) => res.send("server is live"))
app.use('/api/auth', userRouter)
app.use('/api/messages', messageRouter)

//connect to mongoDB
await connectMongoDb()

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 3000
    server.listen(PORT, () => console.log(`server runs on PORT ${PORT}`))
}

//Export server for Vercel
export default server