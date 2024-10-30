import mongoose from "mongoose";
const PLayerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    club:{
        type:String,
        required:true,
        trim:true
    },
    goals:{
        type:Number,
        required:true,
        trim:true
    }
})
const Players=mongoose.models.Players||mongoose.model("Players",PLayerSchema);
module.exports=Players;