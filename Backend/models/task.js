import mongoose from "mongoose";
import { type } from "os";
import { ref } from "process";

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        minlength:3
    },

    description:{
        type:String,
        required:true,
        minlength:5
    },

    deadline:{
        type:Date,
        required:true
    },

    priority:{
        type:String,
        enum:["Low","Medium","High"],
        default:"Medium"
    },

    status:{
        type:String,
        enum:["Pending","in-progress","Completed"],
        default:"Pending"
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

     assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

},{timestamps:true});


export const Task= mongoose.model("Task", taskSchema);
