import mongoose from "mongoose";
const userShecma=new mongoose.Schema({
   username:{type:String,required:true},
   email:{type:String,required:true,unique:true},
   password:{type:String,required:true},
     role: {
    type: String,
    enum: ["admin", "user"],  // ✅ only allowed values
    default: "user"
  }
})

export const User=mongoose.model("User",userShecma)