import path from "path";
import multer from "multer";
import fs from "fs";

/**
 * Create a reusable upload middleware
 * @param {string} folder - the folder to save uploaded files
 * @param {string} fieldName - the form field name
 * @param {number} maxCount - max number of files (optional)
 */
export const createUpload = (folder, fieldName, maxCount = 1) => {

    const uploadDir = path.join(process.cwd(), folder);

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, {recursive: true})

    const storage = multer.diskStorage({
        destination: (req, file, cd) => cd(null, uploadDir), filename: (req, file, cd) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cd(null, uniqueSuffix + path.extname(file.originalname))
        }
    })
    const fileFilter = (req, file, cd) => {
        if (file.mimetype.startsWith("image")) cd(null, true); else cd(new Error("Not an image! Please upload only images."), false)

    }
    const upload = multer({storage, fileFilter})


    if (maxCount === 1) return upload.single(fieldName); else return upload.array(fieldName, maxCount);

};