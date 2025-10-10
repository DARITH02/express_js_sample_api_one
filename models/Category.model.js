import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    title: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    status: {type: Boolean, default: false}

}, {timestamps: true, versionKey: false})
export default mongoose.model("Category", categorySchema)