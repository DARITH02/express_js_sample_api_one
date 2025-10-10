import express from 'express';
import {

    buyCourses,
    deleteCourse,
    getCourseById,
    getPurchasedCourses, getViewCourse,
    postCourse,
    updateCourse
} from "../controllers/coursesController.js";
import {createUpload} from "../middleware/createUpload.js";
import {authMiddleware} from "../middleware/auth.middleware.js";



const router = express.Router();

const uplaodCourseImage = createUpload('public/images/courses', 'image')

router.get('/courses', getCourseById);
router.post('/courses', uplaodCourseImage, postCourse);
router.put("/courses/:id", uplaodCourseImage, updateCourse);
router.delete("/courses/:id", deleteCourse);
router.get("/courses/:title", getCourseById);
router.get("/view-course/:id",getViewCourse)

router.get("/all", authMiddleware, getPurchasedCourses);
router.post("/courses/buy/:courseId", buyCourses);
export default router;