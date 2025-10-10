import UserModel from "../models/User.model.js";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "../config/passport.js";
import userModel from "../models/User.model.js";
// import { decryptStored } from "../utils/crypto.js"; // AES decryption function

export const getUserController = async (req, res, next) => {
    try {
        const users = await UserModel.find();

        res.status(200).json(users)
    } catch (e) {
        next(e)
    }
}
export const postUserController = async (req, res, next) => {
    try {
        if (!req.file) {
            const err = new Error("Image not found")
            err.status = 404
            return next(err)
        }
        const {name, email, password, phones} = req.body;
        const checkEmail = await UserModel.findOne({email: email})
        if (checkEmail) {
            const err = new Error("User already exists")
            err.status = 400
            return next(err)
        }
        const image = path.relative("public", req.file.path).replace(/\\/g, "/")

        const newUser = new UserModel({...req.body, image})
        await newUser.save();
        res.status(201).json(newUser);
    } catch (e) {
        next(e)
    }
}

export const updateUserController = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.params.id);

        if (!user) {
            const err = new Error("User not found")
            err.status = 404
            return next(err)
        }

        if (req.file) {
            // remove old image
            if (user.image) {
                const oldImagePath = path.join(process.cwd(), "public", user.image);
                if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
            }
            // update new image
            user.image = path.relative("public", req.file.path).replace(/\\/g, "/")
        }
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                user[key] = req.body[key];
            }
        })
        await user.save()

        res.status(201).json(user)

    } catch (e) {
        next(e)
    }
}


export const loginController = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        const user = await UserModel.findOne({email});
        if (!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({success: false, message: "Password incorrect"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || "1d"});

        // ✅ Set cookie for frontend
        res.cookie("token", token, {
            httpOnly: false, // frontend JS can read for dev
            secure: false,   // set true if using HTTPS
            sameSite: "lax", maxAge: 24 * 60 * 60 * 1000,
        });

        // ✅ Return success with user and token (frontend can also read directly if needed)
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {id: user._id, email: user.email, image: user.image, name: user.name},
            token, // optional, but helps frontend
        });

    } catch (err) {
        next(err);
    }
};


export const logoutController = async (req, res, next) => {
    try {
        const userId = req.body.id;
        await UserModel.findByIdAndUpdate(userId, {$unset: {token: ""}})
        res.clearCookie("token")
        res.status(200).json({success: true, message: "Logout successfully"})
    } catch (e) {
        next(e)
    }
}


// login with google
export const googleAuth = passport.authenticate("google", {scope: ['profile', 'email']})


// google OAuth callback

export const googleAuthCallback = (req, res, next) => {
    passport.authenticate("google", {
        failureRedirect: "/login", session: false,
    }, async (err, user, info) => {
        if (err) {
            return res.status(500).json({
                success: false, message: "Authentication error", error: err.message
            })
        }
        if (!user) {
            return res.status(401)
        }

        //     generate jwt token (if you're using JWT)
        const token = await user.generateAuthToken()

        //set cookie for frontend

        res.cookie("token", token, {
            httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 24 * 60 * 60 * 1000,
        })
        // redirect to home
        res.redirect(`${process.env.FRONTEND_URL}/auth/success.html?token=${token}`);

    })(req, res, next)
}



export const getUserInfo = (req, res) => {
    res.json({
        success: true,
        user: req.user

    });
};


