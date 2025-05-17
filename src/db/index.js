import { dbName } from "../contance.js";
import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${dbName}`);
        console.log(`mongodb connected connection host !!! ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("mongodb connection error ")
    }
}


export default connectDB;