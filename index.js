import express from "express";


import dotenv from "dotenv";
import path from "path"
import mongoose from "mongoose";
import cors from "cors"
import {errorHandler} from "./middleware/errorHandler.js";
import routes from "./routes/index.js";

import cookieParser from "cookie-parser";

dotenv.config(); // Load .env variables


const index = express();


// Middleware
index.use(cookieParser());
index.use(express.json());

index.use(cors({
    origin: "http://127.0.0.1:5500",  // your frontend URL
    credentials: true                 // important to allow cookies
}));
// Routes
// index.use("/api/", user);
// index.use("/api/", slides);
index.use("/api/", routes);

// upload images


index.use('/images/courses', express.static(path.join(process.cwd(), 'public/images/courses')));


// Error handling middleware
index.use(errorHandler);
index.use(express.static('public'));


// view engine setup
// index.use(express.static("/public/"));
// index.set("view engine", "ejs");
// index.set("views", "./views");
// index.use("/", router);


// Access environment variables
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
const connectDB = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error("MONGO_URI is not defined in .env");
        }

        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true, useUnifiedTopology: true,
        });

        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1); // Exit if DB connection fails
    }
};

// Start the server after DB connection
connectDB().then(() => {
    index.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
