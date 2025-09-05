import mongoose from "mongoose";

//function to connect to the mongodb
export const connectMongoDb = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("database connected"))
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)

    } catch (error) {
        console.log(error);

    }
}