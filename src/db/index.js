import mongoose from "mongoose";
import { db_name } from "../constants.js";

const connectdb= async ()=>
{
    try
    {
        const connnection=await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`)
        console.log(`Mongo db connected db host${connnection.connection.host}`);
    }
    catch(error)
    {
        console.log("failed to connect mongodb server",error);
        process.exit(1)
    }
}

export default connectdb