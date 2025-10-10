import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload folder exists
const uploadDir = path.join(process.cwd(), "uploads/slides");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) cb(null, true);
    else cb(new Error("Not an image! Please upload only images."), false);
};

// Export upload middleware
export const upload = multer({ storage, fileFilter });
