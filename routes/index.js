import express  from "express";
import slidesRoutes from "../routes/slidesRoutes.js";
import CoursesRoutes from "./coursesRoutes.js";
import CategoryRoute from "./categoriesRoutes.js";
import UserRoutes from "./userRoutes.js";

const router = express.Router();

router.use(slidesRoutes)
router.use(CoursesRoutes)
router.use(CategoryRoute)
router.use(UserRoutes)

export default router;



