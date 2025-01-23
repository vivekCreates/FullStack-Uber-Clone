import mongoose from "mongoose"
import { DB_NAME } from "../constant";

const MONGO_URI = process.env.MONGODB_URI;


async function connectdb() {
    try {
        if (!MONGO_URI) {
            throw new Error("Check your connection string of database")
        }
        const connectedInstance = await mongoose.connect(`${MONGO_URI}/${DB_NAME}`)
        console.log(`🌿 Mongo connected ! DB HOST at ${connectedInstance.connection.host} `)
    } catch (error:any) {
        console.log(`db not connected: ${error.message}`)
        process.exit(1)
    }

}

export default connectdb