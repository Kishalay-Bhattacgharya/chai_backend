import mongoose from "mongoose";
import { dbName } from "../constants.js";
const connectDB= async ()=>{
    try {
       const dbConnectionInstance=
       await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`)
       console.log(`MongoDB Connected Successfully !! DB_HOST: ${dbConnectionInstance.connection.host}`);
    } catch (error) {
        console.log(`Mongodb connection has failed : ${error}`)
        process.exit(1)
    }
}

export {connectDB as default}
