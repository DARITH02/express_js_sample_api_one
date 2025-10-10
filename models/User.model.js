import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
// Define schema
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: false},
    phones: {type: String, required: false},
    image: {type: String},
    googleId: {type: String, unique: true, sparse: true},

    puchasCourses: [{type: mongoose.Schema.Types.ObjectId, ref: "Course"}],
    token: {type: String}
}, {versionKey: false, timestamps: true});

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign(
        {

            _id: this._id,
            name: this.name,
            email: this.email,
            image: this.image, // include image


        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    return token;
};

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
        next();
    } catch (error) {
        next(error);
    }
});

// Export model
export default mongoose.model("User", userSchema);
