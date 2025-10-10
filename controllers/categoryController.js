import CategoryModel from "../models/Category.model.js";
export const postCategoriesController = async (req, res, next) => {
    try {
        if (!req.body.title) {
            const err = new Error("Title is required")
            err.status = 400
            return next(err)
        }
        if (!req.body.description) {
            const err = new Error("Description is required")
            err.status = 400
        }
        const {title, slug} = req.body;
        const checkTitle = await CategoryModel.findOne({title});
        const checkSlug = await CategoryModel.findOne({slug});

        if (checkTitle) {
            const err = new Error("Category already exists")
            err.status = 400
            return next(err)
        } else if (checkSlug) {
            const err = new Error("Slug already exists")
            err.status = 400
            return next(err)
        }
        const category = await CategoryModel.create(req.body);
        res.status(200).json({success: true, category})
    } catch (e) {
        next(e);
    }
};
export const getCategoriesController = async (req, res, next) => {
    try {
        // const cateogries=await CategoryModel.find();
        let category;
        const slug = req.params.slug;
        const title = req.params.title;
        if (slug) {
            category = await CategoryModel.find({
                $or: [
                    {slug: {$regex: slug, $options: "i"}}, {title: {$regex: slug, $options: "i"}}]
            })
            if (!category || category.length === 0) {
                const err = new Error("Category not found")
                err.status = 404
                return next(err)
            }
        } else {
            category = await CategoryModel.find()
        }
        res.status(200).json({success: true, category})
    } catch (e) {
        next(e)
    }
}
