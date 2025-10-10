import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    'title': {type: String, required: true},
    'image': {type: String, required: true},
    'create_at': {type: Date, default: Date.now},
    'update_at': {type: Date, default: Date.now}

}, {versionKey: false});
export default mongoose.model("Slide", userSchema)