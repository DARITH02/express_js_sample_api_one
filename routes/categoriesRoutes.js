import express from "express"
const router = express.Router();
// const categoriesController = require('../controllers/categoryController');
import {getCategoriesController, postCategoriesController} from "../controllers/categoryController.js";

router.get("/categories",getCategoriesController)
router.get("/categories/:slug",getCategoriesController)

router.post("/category",postCategoriesController)


export default router;