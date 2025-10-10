import  mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title:{type:String,required:true,trim:true},
    price:{type:Number,required:true},
    description:{type:String,required:true,trim:true},
    image:{type:String,required:true},
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true,
    },
    rating:{type:Number,required:true},
    numReviews:{type:Number,required:true},
    discountPrice:{type:Number,required:true},
    date:{type:Date,default:Date.now},


},{timestamps:true,versionKey:false})
export  default  mongoose.model("Course",courseSchema)