import express from "express";

import {
    getUserController, getUserInfo, googleAuth,
    googleAuthCallback, loginController, logoutController, postUserController, updateUserController
} from "../controllers/userController.js";
import {createUpload} from "../middleware/createUpload.js";
import {verifyToken} from "../middleware/auth.middleware.js";

const uplaodUserImage = createUpload('public/images/users', 'image')

const router = express.Router();

router.get("/users", getUserController)
router.post("/users", uplaodUserImage, postUserController)
router.put("/users/:id", uplaodUserImage, updateUserController)
router.post("/login", loginController)
router.post("/users/logout", logoutController)


router.get("/users/google",googleAuth)
router.get("/users/google/callback",googleAuthCallback)
router.get("/me", verifyToken, getUserInfo);


// const uploadDir = path.join(process.cwd(), "uploads")
// const storage = multer.diskStorage({
//     destination: (req, file, cd) => cd(null, uploadDir),
//     filename: (req, file, cd) => {
//         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
//         cd(null, uniqueSuffix + path.extname(file.originalname))
//     }
// })
//
//
// const fileFilter = (req, file, cd) => {
//     if (file.mimetype.startsWith("image")) cd(null, true); else cd(new Error("Not an image! Please upload only images."), false)
// }
//
// const upload = multer({storage, fileFilter})
//
//
// router.get("/users", async (req, res) => {
//     try {
//         const users = await User.find();
//         // console.log("Users found:", users); // debug
//         // res.render("users/index", { users });
//
//
//         res.json(users);
//     } catch (err) {
//         res.status(500).json({error: err.message});
//     }
// });
//
// router.post("/users", upload.single('image'), async (req, res, next) => {
//     try {
//         // const newUser = new User(req.body);
//         const image = req.file ? req.file.path : undefined;
//     const user=new User({...req.body,image})
//
//         await user.save();
//         res.status(201).json(user);
//     } catch (e) {
//         next(e);
//     }
// })

export default router;
