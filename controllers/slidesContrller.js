import SlideModel from "../models/Slide.model.js";

import fs  from "fs";
import path from "path";
import multer from "multer";


export  const getAllSlid=async (req, res) => {

    try {
        const slides=await SlideModel.find()
        res.status(200).json(slides)
    }catch (e) {
        res.status(500).json({error: e.message})
    }
}
export const deleteSlide = async (req, res,next) => {
    try {
        const id= req.params.id;
        const slide=await SlideModel.findById(id)

        if(!slide){
            const err =new Error("Slide not found")
            err.status=404
          return next(err)
        }

        const filePath=path.join(process.cwd(),slide.image.replace(/^\/+/, ""));
        fs.unlink(filePath, (err) => {
            if(err) console.error("Error deleting file: ",err.message)
        })

        await SlideModel.findByIdAndDelete(id);

        res.json({success:true,message:"Slide deleted successfully"})

    }catch (e) {
        next(e)
    }
}



//
// const uploadDir = path.join(process.cwd(), '/uploads/slides');
//
//
// const storage = multer.diskStorage({
//     destination: (req, file, cd) => cd(null, uploadDir), filename: (req, file, cd) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
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

export const postSlide = async (req, res, next) => {
    try {
        // const image = req.file ? `uploads/slides/${req.file.filename}` : undefined;
        const newSlide = await SlideModel.create({
            title: req.body.title,
            image: `/uploads/slides/${req.file.filename}`, // relative URL
        });
        res.status(201).json(newSlide);
    } catch (e) {
        next(e)
    }


};


