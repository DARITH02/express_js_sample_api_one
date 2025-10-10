import CourseModel from "../models/Course.model.js";
import courseModel from "../models/Course.model.js";
import path from "path";
import fs from "fs";
import userModel from "../models/User.model.js";
import mongoose from "mongoose";


export const getall = async (req, res, next) => {
    try {
        const courses = await CourseModel.find()
        res.status(200).json({success: true, courses})
    } catch (e) {
        next(e)
    }
}

export const postCourse = async (req, res, next) => {
    try {
        // const newCourse=await CourseModel.create(
        //     {
        //         title:res.body.title,
        //         description:res.body.description,
        //         price:res.body.price,
        //         image:res.body.image,
        //         category:res.body.category,
        //
        //     }
        // )

        if (!req.file) {
            const err = new Error("Image not found")
            err.status = 404
            return next(err)
        }
        // const img=new req.body.image;
        // const image=req.file.path;
        const image = path.relative("public", req.file.path).replace(/\\/g, "/")

        const newCourse = new CourseModel({...req.body, image})

        if (!newCourse) {
            const err = new Error("Course upload failed!")
            err.status = 404
            return next(err)
        }
        await newCourse.save()
        res.status(201).json({success: true, message: "Course uploaded successfully", newCourse})

    } catch (e) {
        next(e)
    }
}

export const deleteCourse = async (req, res) => {
    try {
        const course = await CourseModel.findById(req.params.id);
        if (!course) return res.status(404).json({message: "Course not found"});

        // Delete image file from public folder
        if (course.image) {
            const imagePath = path.join(process.cwd(), "public", course.image);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }

        // Delete course from MongoDB
        await CourseModel.findByIdAndDelete(req.params.id);

        res.json({message: "Course deleted successfully"});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};


export const updateCourse = async (req, res) => {
    try {
        const course = await CourseModel.findById(req.params.id);
        if (!course) return res.status(404).json({message: "Course not found"});

        // If a new file is uploaded
        if (req.file) {
            // Delete old image file (optional)
            if (course.image) {
                const oldImagePath = path.join(process.cwd(), "public", course.image);
                if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
            }

            // Save new image path
            course.image = path.relative("public", req.file.path).replace(/\\/g, "/");
        }

        // Update other fields
        Object.keys(req.body).forEach((key) => {
            course[key] = req.body[key];
        });

        await course.save();
        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};


// export const getCourseById = async (req, res, next) => {
//     try {
//         // const title=req.params.title;
//         // const course= await  CourseModel.find({title:title})
//
//         const title = req.query.title; // get ?title=w
//         let courses;
//         if (title) {
//             // Case-insensitive search in MongoDB
//             courses = await CourseModel.find({
//                 title: { $regex: title, $options: "i" }
//             });
//         console.log(courses)
//         } else {
//             courses = await CourseModel.find();
//         }
//
//         // const course = await courseModel.find({
//         //     // title: new RegExp(`^${title}$`, "i") // "i" = ignore case
//         //     title: { $regex: title, $options: "i" }
//         // });
//         // if(!title){
//         //     const err =new Error("Course not found")
//         //     err.status=404
//         //     return next(err)
//         // }
//         res.status(200).json({success:true,course:courses})
//
//     } catch (e) {
//         next(e)
//     }
// }

export const getCourseById = async (req, res, next) => {
    try {
        const title = req.params.title; // get ?title=v
        let courses;

        if (title) {
            courses = await CourseModel.find({
                title: {$regex: title, $options: "i"} // case-insensitive search
            }).populate("category");
        } else {
            courses = await CourseModel.find().populate("category") // get all courses

        }
        const userId = req.user?.id;

        if (userId) {
            // 🧠 Fetch user and get their purchased course IDs
            const user = await UserModel.findById(userId).select("puchasCourses");
            const purchasedIds = user?.puchasCourses?.map((id) => id.toString()) || [];

            // 🏷️ Add "isBought" property to each course
            courses = courses.map((course) => ({
                ...course.toObject(), isBought: purchasedIds.includes(course._id.toString()),
            }));
        }


        res.status(200).json({success: true, courses}); // make sure frontend gets "courses"
    } catch (e) {
        next(e);
    }
};
export const getViewCourse = async (req, res, next) => {
    const {id} = req.params
    const course = await CourseModel.findById(id).populate("category")


    if (!course) {
        const err = new Error("Course not found")
        err.status = 404
        return next(err)
    }
    res.status(200).json({success: true, course})
}

export const buyCourses = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const courseId = req.params.courseId;

        const user = await userModel.findById(userId)
        if (!user) {
            const err = new Error("User not found")
            err.status = 404
            return next(err)
        }

        if (user.puchasCourses.includes(courseId)) {
            const err = new Error("You have already purchased this course")
            err.status = 400
            return next(err)
        }
        user.puchasCourses.push(courseId)
        await user.save();
        res.status(200).json({success: true, message: "Course purchased successfully"})

    } catch (e) {
        next(e)

    }
}


// export const getPurchasedCourses = async (req, res) => {
//     try {
//         const userId = req.user.id;
//
//         const user = await userModel.findById(userId);
//         if (!user) return res.status(404).json({ message: "User not found" });
//
//         // Convert string IDs to ObjectId
//         const courses = await courseModel.find({
//             _id: { $in: user.puchasCourses.map(id => mongoose.Types.ObjectId(id)) }
//         });
//
//         res.json({ success: true, courses });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

export const getPurchasedCourses = async (req, res) => {
    try {
        // // 1. Get the user ID from the JWT middleware
        const userId = req.user.id;
        //
        // // 2. Find the user in the database
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false, message: "User not found"
            });
        }

        //
        // // 3. Get user's purchased courses safely
        const purchasedCoursesIds = user.puchasCourses || []; // Fix typo & default to empty array
        //
        // // 4. Fetch course documents from course collection
        const courses = await courseModel.find({
            _id: {$in: purchasedCoursesIds.map(id => new mongoose.Types.ObjectId(id))}
        });
        //
        // // 5. Return the courses
        res.json({
            success: true, courses
        });
        // res.status(200).json({success: true, purchasedCoursesIds})

    } catch (err) {
        // 6. Handle server errors
        res.status(500).json({
            success: false, message: err.message
        });
    }
};
