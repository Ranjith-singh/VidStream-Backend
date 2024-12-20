import { Schema } from "mongoose";

const subscriptionSchema = new Schema({
    subscriber : {
        type : Schema.Types.ObjectId, // user who is subscribing
        ref : "User"
    },
    channel : {
        type : Schema.Types.ObjectId, // user to which the subscriber has subscribed
        ref : "User"
    }
},{timestamps : true})